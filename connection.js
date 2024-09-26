const { default: mongoose } = require("mongoose");

function connectToDB(path) {
    mongoose.connect(path)
    .then(() => {console.log(`Connected to MongoDB Database:`)
    })
    .catch((error) => {console.log(`Error Connecting: ${error}`)
    })
}
module.exports = connectToDB;