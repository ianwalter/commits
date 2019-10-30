# @ianwalter/commits
> Easy and beautifully-presented git commit lists

[![npm page][npmImage]][npmUrl]
[![CI][ciImage]][ciUrl]

## Installation

```console
yarn add @ianwalter/commits
```

## CLI Usage

Provide the `commits` command with a starting term (that matches text in a
commit message) and optionally an ending term to get a list of commits within
the two commits. If no ending term is provided, `HEAD` will be used.

```console
commits <start> [<end>]
```

Use the `--logLevel debug` flag and option to remove some of the output
formatting if necessary.

## Related

* [@ianwlater/print][printUrl] - Colorful Node.js logging

## License

Hippocratic License - See [LICENSE][licenseUrl]

&nbsp;

Created by [Ian Walter](https://ianwalter.dev)

[npmImage]: https://img.shields.io/npm/v/@ianwalter/commits.svg
[npmUrl]: https://www.npmjs.com/package/@ianwalter/commits
[ciImage]: https://github.com/ianwalter/commits/workflows/CI/badge.svg
[ciUrl]: https://github.com/ianwalter/commits/actions
[printUrl]: https://github.com/ianwalter/print
[licenseUrl]: https://github.com/ianwalter/commits/blob/master/LICENSE
