#!/usr/bin/env node
const program = require('commander');
const download = require('download-git-repo');

program.version('1.0.0', '-v, --version')
    .command('init <name>')
    .action((name) => {
        console.log(name)
    });
program.parse(process.argv);