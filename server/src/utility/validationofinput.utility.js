const fullPattern = /^[A-Za-z ]+$/; // Only letters and spaces
const usernamePattern = /^[A-Za-z0-9_]+$/; // Letters, numbers, underscores
const departmentPattern = /^[A-Za-z ]+$/; // Only letters and spaces
const programPattern = /^[A-Za-z0-9 ]+$/; // Only letters and spaces
const passwordPattern = /^[A-Za-z0-9_@]+$/; // Letters, numbers, underscores


function validation(fullname, username, department, program, password, repeatpassword) {
    if (!fullPattern.test(fullname)) {
        return false
    }

    if (!usernamePattern.test(username)) {
        return false
    }


    if (!departmentPattern.test(department)) {
        return false
    }

    if (!programPattern.test(program)) {
        return false
    }
    if (!passwordPattern.test(password)) {
        return false
    }
    if (!passwordPattern.test(repeatpassword)) {
        return false
    }
}


function validationsignin(username, password) {
   

    if (!usernamePattern.test(username)) {
        return false
    }


    if (!passwordPattern.test(password)) {
        return false
    }
    
}


function validationpassword( password) {
   


    if (!passwordPattern.test(password)) {
        return false
    }
    
}
module.exports = { validation, validationsignin, validationpassword };
