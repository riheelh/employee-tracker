const inquirer = require("inquirer");

const arrObj = [
    {
        name: "james",
        id: 1,
        last: "Long"
    },
    {
        name: "dean",
        id: 2,
        last: "Long"
    },
    {
        name: "Bob",
        id: 3,
        last: "Long"
    },
    {
        name: "Larry",
        id: 4,
        last: "Long"
    },
    {
        name: "Bob",
        id: 5,
        last: "Hamoande"
    },
]

inquirer.prompt([
    {
        type: "list",
        name: "example",
        message: "Pick one",
        choices(){
            let arr = [];
            arrObj.map(element => arr.push(`${element.name} ${element.last}`))

            return arr;
        }
    }
]).then(res => {
    // console.log(res)
    let arrId = arrObj.filter(index => index.name.includes(res.example.split(" ")[0]) && index.last.includes(res.example.split(" ")[1]))
    console.log(arrId[0].id)
})