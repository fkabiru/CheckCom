const sequelizer = require('./../dbFunc/sequelizer.js')
const { Sequelize } = require('sequelize');

const seq = sequelizer.sequelize
const seq_m = sequelizer.sequelize_m

const curUser = sequelizer.User   // impot User model

//Define operater for DB tables
const Op = seq.Op;

//Define operater for in memory tables
const Op_m = seq_m.Op;

const BotEntity = seq.define('Entities',
    {
        owner: {
            type: Sequelize.STRING,
        },
        Entity: {
            type: Sequelize.STRING
        },
        notify: {
            type: Sequelize.INTEGER
        },
        
    })
module.exports.BotEntity = BotEntity

    const createEntity = (entityObj) =>{
        let createStatus = async function(resolve,reject){
            try{
            let useremail = entityObj.username;
            let entity = entityObj.entity;
            let entityId = entityObj.id;
            let notify = entityObj.notify

            // Query user data

            let curuser
            let userObj = await curUser.findAndCountAll({
                where: { username: useremail }
            });
            curuser = userObj.rows[0];
            let userId = curuser.id

            if(entityId){
                await BotEntity.update(
                    { 
                        Entity:entity, notify:notify
                    },
                     {
                    where: {
                      id: entityId
                    }
                  }).then((updated) =>{
                      if(updated >0){
                        resolve({'message':'success'})
                      }
                  }).catch((err) =>{
                    resolve({'message':'failed'})
                    console.log(err)
                  });
            }else{
            await BotEntity.create({
                owner:userId,Entity:entity,notify:notify
            }).then((botentity) => {
                if(botentity instanceof BotEntity){
                    resolve({'message':'success'})
                }
            }).catch((err) => {
                reject(err)
                console.log('DB error', err)
            })
        }
        }catch(err){
            console.log('Error', err)
        }
        return
        }
        return new Promise(createStatus)
    }
    module.exports.createEntity = createEntity

    const getUserEntities =(userObj) =>{
        let queryStatus = async function(resolve,reject){
            try{
                console.log('Querying Entities')
                let useremail = userObj.username
                let userInfo = await curUser.findAndCountAll({
                    where: { username: useremail }
                });
                if(userInfo.count > 0){
                let userData = userInfo.rows[0]

                await BotEntity.findAll({
                    where:{
                        owner:userData.id
                    }
                }).then((allEntities) =>{
                    resolve(allEntities)
                }).catch((err) =>{
                    reject(err)
                    console(err)
                })

            }else{}
            }catch(err){
                reject(err)
                console.log(err)
            }
            return
        }
        return new Promise(queryStatus)
    }

    module.exports.getUserEntities = getUserEntities

