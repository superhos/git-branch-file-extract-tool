## 作用
用于在分支中，根据规则搜索commit log内容然后提取出该内容对应提交的文件。

## 使用要求
由于是基于本人项目写的工具，目前规则是根据bug trace id去查找，id的格式是七位数，例如00000820。开发规范是要求提交的时候在commit log中注明bug trace id和简单的修改主要内容描述。
只要修改sync方法中的对比项即可适应个人项目。

## 安装和使用方法

1. 安装依赖包

```
npm install
```

2. 一句话命令

```
babel-node run.js c:/project/branch 820
```
**c:/project/branch** 为项目地址，会根据项目目前Brunch来查找commit
**820** 为trace bug id

## Purpose
Used to extract the modified files which are search by specific search rules from specific branch.

## Requirements
Since this project is base on my own project. I use bug trace id and bug summary as commit log. Thus my search rules is search the bug trace id.
You just need to update the condition of equation of sync function to suit your own project if you want to use this tool.

## Installation

1. Install dependency package

```
npm install
```

2. One command

```
babel-node run.js c:/project/branch 820
```
**c:/project/branch** stands for the path of project, the branch which tool will use is determined by this path.
**820** stands for trace bug id

