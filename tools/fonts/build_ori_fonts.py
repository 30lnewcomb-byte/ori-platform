from __future__ import annotations

from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "tools" / "fonts" / "source"
OUTPUT_DIR = ROOT / "apps" / "web" / "public" / "fonts"

ASCII_RANGE = range(0x20, 0x7F)


def rename_family(font: TTFont, family: str) -> None:
    for record in font["name"].names:
        if record.nameID == 1:
            value = family
        elif record.nameID == 2:
            value = "Regular"
        elif record.nameID == 4:
            value = f"{family} Regular"
        elif record.nameID == 6:
            value = f"{family.replace(' ', '')}-Regular"
        elif record.nameID == 16:
            value = family
        elif record.nameID == 17:
            value = "Regular"
        else:
            continue
        record.string = value.encode(record.getEncoding())


def build_font(source: Path, output: Path, family: str, monospace: bool = False) -> None:
    font = TTFont(str(source))

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["kern", "liga", "calt"]
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 16, 17]

    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=ASCII_RANGE)
    subsetter.subset(font)

    rename_family(font, family)

    if monospace:
        fixed_width = max(font["hmtx"][glyph][0] for glyph in font.getGlyphOrder())
        for glyph in font.getGlyphOrder():
            _, lsb = font["hmtx"][glyph]
            font["hmtx"][glyph] = (fixed_width, lsb)
        font["OS/2"].usWidthClass = 5

    output.parent.mkdir(parents=True, exist_ok=True)
    font.save(str(output))


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    build_font(
        SOURCE_DIR / "Inter-Regular.otf",
        OUTPUT_DIR / "OriText-Regular.woff2",
        "Ori Text",
    )
    build_font(
        SOURCE_DIR / "InterDisplay-Regular.otf",
        OUTPUT_DIR / "OriDisplay-Regular.woff2",
        "Ori Display",
    )
    build_font(
        SOURCE_DIR / "Inter-Regular.otf",
        OUTPUT_DIR / "OriMono-Regular.woff2",
        "Ori Mono",
        monospace=True,
    )

    for path in sorted(OUTPUT_DIR.glob("Ori*-Regular.woff2")):
        print(f"{path}: {path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
