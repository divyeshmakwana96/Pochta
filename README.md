Pochta (почта)
======

<h1 align="center">
  <br>
  <img src="logo/pochta-logo.png" alt="Pochta" width="230">
  <br>
</h1>

<h4 align="center">Testing MJML/HTML emails simplified</h4>

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/pochta.svg)](https://npmjs.org/package/pochta)
[![Downloads/week](https://img.shields.io/npm/dw/pochta.svg)](https://npmjs.org/package/pochta)
[![License](https://img.shields.io/npm/l/pochta.svg)](https://github.com/divyeshmakwana96/pochta/blob/master/package.json)

## Introduction
Pochta is an open source cli application to help developers send test emails. Conventionally you need an email client or some form of API integration. Pochta eliminates that need and helps enhance your email testing workflow.

### Features
- MJML support
- Multiple email service providers
- Multiple cdn integrations
- Smart cache for image uploads
- Contact management
- Screenshots
- build and export
- Minify HTML

## Getting started
### Installation
```console
$ npm i pochta-mjml -g 
```

### Example Usage
Below are a few basic examples, run `$ pochta help` for more details.

Send an email:
```console
$ pochta send 
```

Create a profile:
```console
$ pochta profiles new 
```

Create an esp:
```console
$ pochta esp new 
```

Create a contact:
```console
$ pochta contacts new 
```

Create an image hosting provider:
```console
$ pochta hosts new 
```

Take a screenshot:
```console
$ pochta capture 
```

Take a screenshot (advanced example):
- The example below will generate 320 and 800 pixel wide screenshots @3 device scale factor. The output will be in the pdf format.
```console
$ pochta capture -w 320 -w 800 -d 3 -f pdf
```



## Why Pochta?
If you are using the MJML app you can use MailJet integration to test your emails. However, neither your local images get hosted on the MailJet server, nor you get an option to embed images as inline attachments. You also don't get to host on your preferred CDN directly.

Of course, these limitations can be overcome by exporting HTML manually and/or updating image sources. If your assets are constantly changing during the development then it would be a tedious task.

If you don't have a MailJet account then you're probably relying on Outlook 2010's stationary feature. The outlook is notorious for changing the HTML content and will mess up your layouts in unintended ways.
Pochta eliminates these limitations, and you can have multiple CDN and ESP for your need. Additionally, you can build and export your email with a CDN provider for the e-blast distribution. Pochta will take care of parsing, uploading, and updating image sources for you. You will have multiple options to choose from for image distribution.

Pochta also has a built-in **capture** feature that can take screenshots of your email for various device widths and scale factors. You will be able to take Retina or higher size screenshots for the mobile devices.

Below are some email and CDN service providers that are currently supported by Pochta:
-----------
#### Email Service Providers
- SendGrid
- MailJet
- Amazon SES
- Gmail
- Microsoft Exchange

#### CDN
- AWS S3
- Cloudinary
- ImageKit

## Manual
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
pochta-mjml/1.1.1 darwin-x64 node-v14.0.0
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
* [`pochta clear ENTITY`](#pochta-clear-entity)
* [`pochta connections ACTION`](#pochta-connections-action)
* [`pochta contacts ACTION`](#pochta-contacts-action)
* [`pochta esp ACTION`](#pochta-esp-action)
* [`pochta help [COMMAND]`](#pochta-help-command)
* [`pochta hosts ACTION`](#pochta-hosts-action)
* [`pochta profiles ACTION`](#pochta-profiles-action)
* [`pochta send`](#pochta-send)

## `pochta build`

Build html/mjml files and export content into a new directory

```
USAGE
  $ pochta build

OPTIONS
  -c, --cache=cache  Boolean flag to enable/disable upload cache

DESCRIPTION
  This command generates HTML by parsing MJML/HTML and hosting images to the dedicated cdn provider. If no host selected 
  then, either the images can be embedded as Base64 or can be exported to a directory related to the generated html 
  file.

  By default the cache is disabled, meaning on each usage of this command it will try to upload images to the preferred 
  cdn provider. If you want to enable cache use with --cache=true flag.
```

_See code: [src/commands/build.js](https://github.com/divyeshmakwana96/pochta/blob/v1.1.1/src/commands/build.js)_

## `pochta capture`

Capture html/mjml screenshot and save in various format (i.e. png, jpg, pdf)

```
USAGE
  $ pochta capture

OPTIONS
  -d, --dsf=dsf             [default: 1] Device Scale Factor. Specifies that the screenshot must be taken at a higher
                            DPI

  -f, --format=jpg|png|pdf  [default: png] Screenshot export format

  -q, --quality=quality     [default: 80] Screenshot quality. Eligible only for if the export format is jpg

  -w, --width=width         [default: 800] Width of the screenshot. If multiple flags are provided, the command will
                            export and save screenshots for each width

DESCRIPTION
  This command generates a screenshot of the email and saves it under captures directory. In order for this command to 
  work a Chrome browser must be installed on the machine. The default screenshot width is 800px and will export as a 
  PNG.

  The default width can be overwritten with the width flag. This command supports multiple widths and it is helpful if 
  you like to capture different sizes. This is extremely helpful for responsive emails or checking email behaviour on 
  multiple sizes.

  If the dfg (Device Scale Factor) flag is set, the screenshots will result as scaled without loosing the quality. Ideal 
  for mimicking mobile devices screenshots.

  Screenshot quality and formats can be changed respectively via quality and format flags.

  The screenshot(s) will overwrite any existing files of the same names.
```

_See code: [src/commands/capture.js](https://github.com/divyeshmakwana96/pochta/blob/v1.1.1/src/commands/capture.js)_

## `pochta clear ENTITY`

Clears cached settings

```
USAGE
  $ pochta clear ENTITY

ARGUMENTS
  ENTITY  (cache) [default: cache] Entity you would like to clear

DESCRIPTION
  This command will delete all the settings stored in a local directory or globally.

  If argument cache is given, it will remove previous user selections and cdn upload cache stored for the current 
  directory.
```

_See code: [src/commands/clear.js](https://github.com/divyeshmakwana96/pochta/blob/v1.1.1/src/commands/clear.js)_

## `pochta connections ACTION`

Create, Read, Update, Delete, Test and Sync connections

```
USAGE
  $ pochta connections ACTION

ARGUMENTS
  ACTION  (list|new) [default: list] Action for the command

DESCRIPTION
  A connection is a form of integration which enhances and/or aids existing functionalities of Pochta. Connections are 
  built for manipulating root setting or adding features which don't belong to Pochta's core functionalities.

  Currently, only Redmine (version 4.0+) connection is supported. Adding this connection will sync contacts and user 
  profile with your account.
```

_See code: [src/commands/connections.js](https://github.com/divyeshmakwana96/pochta/blob/v1.1.1/src/commands/connections.js)_

## `pochta contacts ACTION`

Create, Read, Update and Delete contacts

```
USAGE
  $ pochta contacts ACTION

ARGUMENTS
  ACTION  (list|new) [default: list] Action for the command

DESCRIPTION
  A contact is a form of recipients for supporting multiselect functionality to fill TO or CC fields.
```

_See code: [src/commands/contacts.js](https://github.com/divyeshmakwana96/pochta/blob/v1.1.1/src/commands/contacts.js)_

## `pochta esp ACTION`

Create, Read, Update, Delete and Test ESP

```
USAGE
  $ pochta esp ACTION

ARGUMENTS
  ACTION  (list|new) [default: list] Action for the command

DESCRIPTION
  ESP or Email Service Providers are required to send out test emails. There are two types of ESP currently supported by 
  Pochta:
  1) SMTP
  2) API based

  Configurations need to be setup on their dedicated platforms in order to work with Pochta.
```

_See code: [src/commands/esp.js](https://github.com/divyeshmakwana96/pochta/blob/v1.1.1/src/commands/esp.js)_

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

## `pochta hosts ACTION`

Create, Read, Update, Delete and Test image hosting providers

```
USAGE
  $ pochta hosts ACTION

ARGUMENTS
  ACTION  (list|new) [default: list] Action for the command

DESCRIPTION
  Configure your CDN provider with Pochta using this command. APIs needs to be enabled on the dedicated platforms in 
  order to work with Pochta.
```

_See code: [src/commands/hosts.js](https://github.com/divyeshmakwana96/pochta/blob/v1.1.1/src/commands/hosts.js)_

## `pochta profiles ACTION`

Create, Read, Update and Delete profiles

```
USAGE
  $ pochta profiles ACTION

ARGUMENTS
  ACTION  (list|new) [default: list] Action for the command

DESCRIPTION
  A profile is a contact which is displayed as an identification when sending out emails. This helps enable 
  functionalities to auto include as cc or reply to.
```

_See code: [src/commands/profiles.js](https://github.com/divyeshmakwana96/pochta/blob/v1.1.1/src/commands/profiles.js)_

## `pochta send`

Build, export and send HTML/MJML files as test emails with attachments

```
USAGE
  $ pochta send

OPTIONS
  -c, --cache=cache  Boolean flag to enable/disable upload cache

DESCRIPTION
  This command will provide a guide and selection process for sending out test emails. You can add additional 
  attachments from the current directory with the email.

  Subject line is derived from html's <title> tag. If the tag is missing Pochta will set a default value.

  An Image hosting provider is not necessary since Pochta can embed images inline or as attachments.

  Currently supported attachment types are: 'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'mp4', 'webm', 'mov', 
  'zip', 'txt'
```

_See code: [src/commands/send.js](https://github.com/divyeshmakwana96/pochta/blob/v1.1.1/src/commands/send.js)_
<!-- commandsstop -->
