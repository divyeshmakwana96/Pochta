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
* [`pochta contacts`](#pochta-contacts)
* [`pochta help [COMMAND]`](#pochta-help-command)
* [`pochta hosts`](#pochta-hosts)
* [`pochta send`](#pochta-send)

## `pochta contacts`

Describe the command here

```
USAGE
  $ pochta contacts

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/contacts.js](https://github.com/sleekuser/pochta/blob/v1.0.2/src/commands/contacts.js)_

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

## `pochta hosts`

Describe the command here

```
USAGE
  $ pochta hosts

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/host-controller.js](https://github.com/sleekuser/pochta/blob/v1.0.2/src/commands/hosts.js)_

## `pochta send`

setup hosting environments and send mjml/html test emails

```
USAGE
  $ pochta send
```

_See code: [src/commands/send.js](https://github.com/sleekuser/pochta/blob/v1.0.2/src/commands/send.js)_
<!-- commandsstop -->
