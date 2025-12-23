import json
import os
from pathlib import Path
from typing import TypeVar

from pydantic import BaseModel, TypeAdapter

T = TypeVar("T")


def cache_to_file(path: Path, data_type: TypeAdapter[T] | type[BaseModel]):
    """Decorator to cache function results to a JSON file.

    Args:
        path: Path to the cache file
        data_type: Either a Pydantic BaseModel class or a TypeAdapter for complex types like lists
    """

    def decorator(func):
        def wrapper(*args, **kwargs):
            if path.exists():
                try:
                    with path.open("r", encoding="utf-8") as f:
                        content = f.read()
                        if isinstance(data_type, TypeAdapter):
                            return data_type.validate_json(content)
                        else:
                            return data_type.model_validate_json(content)
                except (json.JSONDecodeError, IOError, ValueError):
                    pass
            result = func(*args, **kwargs)
            os.makedirs(path.parent, exist_ok=True)
            with path.open("w", encoding="utf-8") as f:
                if isinstance(data_type, TypeAdapter):
                    f.write(data_type.dump_json(result, indent=2).decode("utf-8"))
                else:
                    if isinstance(result, BaseModel):
                        f.write(result.model_dump_json(indent=2))
                    else:
                        json.dump(result, f, ensure_ascii=False, indent=2)
            return result

        return wrapper

    return decorator
