# 🎨 Atelier

> 🚧 WORK IN PROGRESS

## Introduction

Generative art projects have a special place in the landscape of software development. Creative coding lets us explore and wander around, sometimes without a clear goal in mind.

Atelier is a tool for generative artists to automatically screenshot and commit their work as they progress through their explorations. This guarantees nothing's ever lost, and all the changes made to a project may be replayed. Also, the artist is free to branch off of a previous iteration of their algorithm as they see fit, retrace their steps, and make their way back. It's all about ensuring you can create without the anxiety of potentially losing your work.

### Motivation

I wanted to create this so that I would feel like having more freedom when coding generative art projects. You install atelier on your machine, and then work across your projects with it; it is not part of the project, it is only peripheral to it. Kind of like a painter's atelier, that's the place where they go to perfect their craft. Atelier was built with that in mind. It's not getting in your way; you install it globally and then it is with you everywhere you go, works the way you want it, saves you time, brings confidence, joy. This project is very recent but has been brewing in my head for a long time. I'm so glad I finally found the time to put its first version together. Now, I'm actively playing around and iterating on it, so it might not be the most stable. That's why I'm not avertising it on my socials yet. And I'd be very surprised if anyone would read this, ever. But anyways, contributions are absolutely welcomed. Even if only for ideas.

### Features

This command line based tool will watch for changes in your project, and can be configured to perform the following actions when you save a file:

- Take a screenshot
- Take a video
- Automatic commit

For now, it is the most simple thing ever. But I have plans to add more useful features that will make building generative artwork projects even more pleasant and relaxing. Stay tuned!

## Installation

Atelier being a self-contained CLI application, it is recommended to install it globally as such:

```bash
npm install --global @genart/atelier
```

## Usage

When installed globally, you may start atelier by doing either

```bash
atelier
```

or

```bash
atelier start
```

### Options

TODO: List out all command line options.

## Configuration

You may configure atelier by creating an `atelier.json` file at the root of your project, or by adding and `atelier` entry in your `package.json` file.

TODO: List out all configuration options.

## TODOs

- Test on a new project
- Refine & document configuration file
- Recording duration in ms instead of seconds
- Timeline: revert to commit hash action
- Timeline: cloak hide stuff
- Timeline: handle empty state
- Init script: add .atelier to .gitignore if exists
- CLI Action: init project (generate customised config file)
- CLI Action: new (creates new project from git template, include p5js, fxhash or not etc)
- CLI Action: clear command to remove everything (with --since --after --days option?)
- Ability to pass raw json as --config parameter to CLI
- Better console output (emoji as constants, everywhere applicable, colors etc)
- Check new version
- Timeline: Ability to filter by time, type
- Replay command: generate a video showing the evolution of the project (pass amount of frames, start, end timestamps, --now, --end and use ffmpeg to generate a video from screenshots)
