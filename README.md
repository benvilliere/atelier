# Atelier

> WORK IN PROGRESS

## Introduction

Generative art projects have a special place in the landscape of software development. Creative coding lets us explore and wander around, sometimes without a clear goal in mind.

Atelier is a tool for generative artists to automatically screenshot and commit their work as they progress through their explorations. This guarantees nothing's ever lost, and all the changes made to a project may be replayed. Also, the artist is free to branch off of a previous iteration of their algorithm as they see fit, retrace their steps, and make their way back. It's all about ensuring you can create without the anxiety of potentially losing your work.

## Installation

```bash
npm install @genart/atelier
```

## Configuration

You may configure atelier by creating a `atelier.json`, `atelier.config.json` or by adding and `atelier` entry in your `package.json` file.

TODO: List out all configuration options.

## TODO

- Merge `base` config with user config
- Create init command that runs post-install to create default config file
- Ensure custom preview URL can be provided and screenshotted
- Maintain changelog for easier retrieval
- Start building time-machine like view
