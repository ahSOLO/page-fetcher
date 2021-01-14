const args = process.argv.slice(2,4);
const request = require("request");
const fs = require("fs");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

request(args[0], (error, response, body) => {
  // Return if error is found
  if (error) {
    console.log('error:', error); // Print the error if one occurred.
    return;
  }

  // Return if non 200's status code is received
  if (response.statusCode > 300 || response.statusCode < 200) {
    console.log('statusCode:', response && response.statusCode); // Print the non 200's status code
    return;
  }

  // Check if filename already exists
  fs.open(args[1], 'wx', (err, fd) => {
    if (err) {
        // If filename already exists, prompt user to overwrite the file
        if (err.code === 'EEXIST') {
          console.error(args[1], 'already exists!');
          rl.question("type 'yes' if you want to overwrite the file.\n", (answer) => {
            if (answer === "yes") {
              fs.writeFile(args[1], body, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
              });
              rl.close();
            } else {
              rl.close();
            }
          });
        }
        // If different error code, throw error
        else {
          throw err;
        }
    } else {
      // Write the body to a file
      fs.writeFile(args[1], body, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    }
  });
});