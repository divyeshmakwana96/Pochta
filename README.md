pochta
======

Test emails simplified

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/pochta.svg)](https://npmjs.org/package/pochta)
[![Downloads/week](https://img.shields.io/npm/dw/pochta.svg)](https://npmjs.org/package/pochta)
[![License](https://img.shields.io/npm/l/pochta.svg)](https://github.com/sleekuser/pochta/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g pochta-mjml
$ pochta COMMAND
running command...
$ pochta (-v|--version|version)
pochta-mjml/1.0.2 darwin-x64 node-v14.0.0
$ pochta --help [COMMAND]
USAGE
  $ pochta COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`pochta build`](#pochta-build)
* [`pochta capture`](#pochta-capture)
* [`pochta clear [ENTITY]`](#pochta-clear-entity)
* [`pochta connections [ACTION]`](#pochta-connections-action)
* [`pochta contacts [ACTION]`](#pochta-contacts-action)
* [`pochta esp [ACTION]`](#pochta-esp-action)
* [`pochta help [COMMAND]`](#pochta-help-command)
* [`pochta hosts [ACTION]`](#pochta-hosts-action)
* [`pochta profiles [ACTION]`](#pochta-profiles-action)
* [`pochta send`](#pochta-send)

## `pochta build`

setup hosting environments and send mjml/html test emails

```
USAGE
  $ pochta build

OPTIONS
  -c, --cache=cache  use upload cache
```

_See code: [src/commands/build.js](https://github.com/sleekuser/pochta/blob/v1.0.2/src/commands/build.js)_

## `pochta capture`

Describe the command here

```
USAGE
  $ pochta capture

OPTIONS
  -d, --dsf=dsf             [default: 1] device scale factor
  -f, --format=jpg|png|pdf  [default: png] format which you would like to capture
  -q, --quality=quality     [default: 80] capture quality (i.e. pdf, jpg)
  -w, --width=width         [default: 800] capture widths comma separated

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/capture.js](https://github.com/sleekuser/pochta/blob/v1.0.2/src/commands/capture.js)_

## `pochta clear [ENTITY]`

Describe the command here

```
USAGE
  $ pochta clear [ENTITY]

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/clear.js](https://github.com/sleekuser/pochta/blob/v1.0.2/src/commands/clear.js)_

## `pochta connections [ACTION]`

Describe the command here

```
USAGE
  $ pochta connections [ACTION]

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/connections.js](https://github.com/sleekuser/pochta/blob/v1.0.2/src/commands/connections.js)_

## `pochta contacts [ACTION]`

Describe the command here

```
USAGE
  $ pochta contacts [ACTION]

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/contacts.js](https://github.com/sleekuser/pochta/blob/v1.0.2/src/commands/contacts.js)_

## `pochta esp [ACTION]`

Describe the command here

```
USAGE
  $ pochta esp [ACTION]

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/esp.js](https://github.com/sleekuser/pochta/blob/v1.0.2/src/commands/esp.js)_

## `pochta help [COMMAND]`

display help for pochta

```
USAGE
  $ pochta help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `pochta hosts [ACTION]`

Describe the command here

```
USAGE
  $ pochta hosts [ACTION]

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/hosts.js](https://github.com/sleekuser/pochta/blob/v1.0.2/src/commands/hosts.js)_

## `pochta profiles [ACTION]`

Describe the command here

```
USAGE
  $ pochta profiles [ACTION]

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/profiles.js](https://github.com/sleekuser/pochta/blob/v1.0.2/src/commands/profiles.js)_

## `pochta send`

setup hosting environments and send mjml/html test emails

```
USAGE
  $ pochta send

OPTIONS
  -c, --cache=cache  use upload cache
```

_See code: [src/commands/send.js](https://github.com/sleekuser/pochta/blob/v1.0.2/src/commands/send.js)_
<!-- commandsstop -->
