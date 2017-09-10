/*创建数据库 运行 node note.js*/

var Sequelize = require('sequelize');
var path = require('path');

var sequelize = new Sequelize(undefined, undefined, undefined, {
    host: 'localhost',
    dialect: 'sqlite',
    // SQLite only
    storage: path.join(__dirname, '../database/database.sqlite')
});

/* 测试连接是否成功
node note.js

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

*/


var Note = sequelize.define('note', {
    text: {
        type: Sequelize.STRING
    },
    userid: {
        type: Sequelize.INTEGER
    },
    username: {
        type: Sequelize.STRING
    }
});

Note.sync();

/*
删除表
Note.drop();
*/


/*
//创建数据库

Note.sync().then(function(){
     Note.create({text:"sdsdsdsd"});
}).then(function(){
    //查询表
    Note.findAll({raw:true}).then(function(notes){
        console.log(notes);
    })
});
*/




module.exports = Note;