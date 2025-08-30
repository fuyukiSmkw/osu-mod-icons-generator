# osu-mod-icons-generator

A script to make osu!lazer mod icons with Inkscape

## Examples

The icon is actually for BU instead of AD tho lol

- `template.svg`, `design.svg`: ![Design 1](design.png)
- `template2.svg`, `design2.svg`: ![Design 2](design2.png)
- `template3.svg`, `design3.svg`: ![Design 3](design3.png)

## Requirements

- any version of node that supports `fs`, `path` and `child_process`
- Inkscape >= `1.0`

## Run

TEMPLATE defaults to `./template.svg` .

```bash
TEMPLATE="template2.svg" node make-pngs.mjs
```

## Acknowledgements

- [osu!web](https://github.com/ppy/osu-web/tree/master/public/images/badges/mods/blanks) for `modblanks/*` (edited)
- [osu!lazer](https://github.com/ppy/osu-resources/tree/master/osu.Game.Resources/Textures/icons/mods) for `modicons/*`

## License

AGPL-3.0-or-later
