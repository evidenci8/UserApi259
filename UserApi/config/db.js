const {Sequelize} =require ('sequelize'); 


const sequelize = new Sequelize ('userauth', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',

})


const connectDB = async() =>{
    try {
        await sequelize.authenticate()
        console.log('Connected to database')
        } catch (error) {
            console.error('Error connecting to database', error)
}

}

module.exports ={sequelize,connectDB }