from dictionary.data_types import (
    Aspect,
    Degree,
    Gender,
    Mood,
    Number,
    PartOfSpeechEnglish,
    PartOfSpeechGreek,
    Person,
    Ptosi,
    Tense,
    VerbForm,
    Voice,
    Word,
)


def word_from_record(record: dict) -> Word:
    """Convert a database record (dict) to a Word object.

    Args:
        record: Dictionary with keys matching the 'words' table columns

    Returns:
        Word object populated from the record
    """

    # Helper to convert empty strings and None to None
    def _clean(value):
        return value if value and value != "" else None

    # Map enum fields, handling None and empty string values
    pos_en = PartOfSpeechEnglish(record["pos"]) if _clean(record.get("pos")) else None
    pos_el = (
        PartOfSpeechGreek(record["greek_pos"])
        if _clean(record.get("greek_pos"))
        else None
    )
    gender = Gender(record["gender"]) if _clean(record.get("gender")) else None
    ptosi = Ptosi(record["ptosi"]) if _clean(record.get("ptosi")) else None
    number = Number(record["number"]) if _clean(record.get("number")) else None
    degree = Degree(record["degree"]) if _clean(record.get("degree")) else None
    person = Person(str(record["person"])) if record.get("person") is not None else None
    tense = Tense(record["tense"]) if _clean(record.get("tense")) else None
    aspect = Aspect(record["aspect"]) if _clean(record.get("aspect")) else None
    mood = Mood(record["mood"]) if _clean(record.get("mood")) else None
    verbform = VerbForm(record["verbform"]) if _clean(record.get("verbform")) else None
    voice = Voice(record["voice"]) if _clean(record.get("voice")) else None
    tags = record["tags"] if _clean(record.get("tags")) else None

    return Word(
        form=record["form"],
        lemma=record["lemma"],
        pos_en=pos_en,
        pos_el=pos_el,
        gender=gender,
        ptosi=ptosi,
        number=number,
        degree=degree,
        person=person,
        tense=tense,
        aspect=aspect,
        mood=mood,
        verbform=verbform,
        voice=voice,
        tags=tags,
    )
