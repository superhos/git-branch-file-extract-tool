var args = process.argv.splice(2);

var basicPath = args[0];//'C:/wamp/www/vmk_0704';
var git = require('simple-git')(basicPath);
var fs = require('fs');

var gitSync = function(){
	this.logs = [];
	this.fileName = 'file';
}

gitSync.prototype = {
	//獲得所有Logs
	getLogs: function(){
		var _this = this;
		return new Promise(function(resolve,reject){
			git.log(function(err,log){
				_this.logs = log;
				resolve(log);
			});
		})
	},
	//開始同步
	sync: async function(issueNumList){
		var _this = this;
		var relatedLogs = [];
		_this.fileName = issueNumList.join('_') + '_file';
		//1.獲取Logs
		await this.getLogs();
		//2.整理issueName 格式
		for (var i in issueNumList){
			issueNumList[i] = _this.fillZero(issueNumList[i]);
			// relatedLogs[issueNumList[i]] = [];
		}
		//3.遍歷尋找跟issueNumList相關的Logs
		for (var i in _this.logs.all){
			for (var n in issueNumList){
				if (_this.logs.all[i].message.indexOf(issueNumList[n]) > -1){
					// console.log(_this.logs.all[i].hash);
					// relatedLogs[issueNumList[n]].push(_this.logs.all[i]);
					_this.logs.all[i].issue = issueNumList[n];
					relatedLogs.push(_this.logs.all[i]);
				}
			}
		}

		relatedLogs = Array.from(new Set(relatedLogs));
		//4.將 relatedLogs 根據update時間重新排序
		relatedLogs.sort(function(a,b){
			var aDate = new Date(a.date);
			var bDate = new Date(b.date);
			if (aDate < bDate){
				return -1;
			}	

			if (aDate > bDate){
				return 1;
			}

			return 0;
		});

		//5.复制文档到指定位置
		_this.moveFile(relatedLogs);

	},
	moveFile: function(list){
		var _this = this;
		for (var i in list){
			var files = list[i].files.split('\n');
			for (var n in files){
				if (files[n].length == 0)continue;
				// console.log(basicPath + '/' + files[n]);
				// fs.createReadStream(basicPath + '/' + files[n]).pipe(fs.createWriteStream('./file/'+files[n]));
				_this.writeFile(files[n]);
			}
		}
	},
	writeFile: function (path){
		var paths = path.split('/');
		var _this = this;
		var currentFile = '';

		//create file first
		if (!fs.existsSync(__dirname + '/' + _this.fileName)){
			fs.mkdir(__dirname + '/' + _this.fileName);
		}

		// console.log(paths.length);
		for (var i in paths){
			currentFile += '/' + paths[i];
			// console.log(__dirname + '/file/' + currentFile);
			//判斷是否存在
			// console.log(fs.existsSync(__dirname + '/file/' + currentFile));
			var stat = fs.lstatSync(basicPath + '/' + currentFile);
			if (!fs.existsSync(__dirname + '/'+_this.fileName+'/' + currentFile)){
			// 	//根据判断是否是文件
			// 	if (!stat.isDirectory()){
			// 		console.log('Cover File: ' + basicPath + '/' + currentFile);
			// 		fs.unlinkSync(__dirname + '/file/' + currentFile);
			// 		fs.createReadStream(basicPath + '/' + currentFile).pipe(fs.createWriteStream(__dirname + '/file/'+currentFile));
			// 	}
			// }else{
				// console.log('not exist');
				//判斷是否是文件
				if (stat.isDirectory()){
					console.log('Write directory:' + currentFile);
					fs.mkdir(__dirname + '/'+_this.fileName+'/' + currentFile);
				}else{
					console.log('write file:' + './'+_this.fileName+'/'+currentFile);
					fs.createReadStream(basicPath + '/' + currentFile).pipe(fs.createWriteStream(__dirname + '/'+_this.fileName+'/'+currentFile));
				}
			}
		}
	},
	//補齊issue number至7位
	fillZero: function(issueNum){
		var zeroCount = 7 - issueNum.length;
		var result = '';
		for(var i = 0; i < zeroCount;i++)result += 0;
		return result + issueNum;
	}
}

var tool = new gitSync();
var numbers = args[1].split(',');
tool.sync(numbers);//['828']);