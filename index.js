#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');

const _VERSION_ = '0.0.5';  // 版本号

const templates = ['nodejs-simple', 'webpack-multi-project'];

program.version(_VERSION_, '-v, --version')
    .command('init <name>')
    .action((name) => {
        if(!fs.existsSync(name)){
            inquirer.prompt([
                {
                    name: 'name',
                    message: 'Project name',
                    default: name
                }, {
                    name: 'description',
                    message: 'Project description',
                    default: 'A Node.js Simple Project'
                }, {
                    name: 'author',
                    message: 'Author',
                    default: 'anonymity'
                }, {
                    type: 'list',
                    name: 'template',
                    message: 'Choose template',
                    choices: templates,
                    default: 'nodejs-simple'
                }
            ]).then((answers) => {
                const spinner = ora('downloading template...');
                spinner.start();
                download(`direct:https://github.com/gyxing/${answers.template}.git#master`, name, {clone: true}, (err) => {
                    if(err){
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    }else{
                        spinner.succeed();
                        const fileName = `${name}/package.json`;
                        const meta = {
                            name: answers.name,
                            description: answers.description,
                            author: answers.author
                        }
                        if(fs.existsSync(fileName)){
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
                        }
                        console.log(symbols.success, chalk.green('Project initialization finished!'));
                    }
                })
            })
        }else{
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('Project already exists!'));
        }
    })
program.parse(process.argv);