const express = require('express');
const http = require('http');
const mysql = require('mysql2');
const url = require("url");
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('./data').userDB;
const app = express();
const server = http.createServer(app);
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/registration', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    try {
        const { name, address, aadhar, city, state, pincode, account, charge, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_expe, username, password, repassword } = req.body;

        const sql = "INSERT INTO registration (name, address, aadhar, city, state, pincode, account, charge, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_expe, username, password, repassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const values = [name, address, aadhar, city, state, pincode, account, charge, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_expe, username, password, repassword];


        mydb.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error inserting record: ", err);
                res.status(500).send("Error inserting record");
                return;
            }
            console.log("Record inserted.");
            res.sendFile(path.join(__dirname, 'public', 'registration.html'));
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error processing request");
    }
});




app.post('/login', (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    const { username, password } = req.body;

    const sql = "SELECT * FROM registration WHERE username = ? AND password = ?";
    const values = [username, password];

    mydb.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (result.length > 0) {
            res.redirect('/sucess');
        } else {
            res.redirect('/unsucess');
        }
    });
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'owner_login.html'));
});

app.get('/unsucess', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'owner_login.html'));
});

app.get('/sucess', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    mydb.connect(function (err) {
        if (err) throw err;

        console.log("connected");

        mydb.query(" select * from registration", function (err, result) {
            if (err) throw err;

            const fs = require('fs');

            const databasedata = JSON.stringify(result);

            const filePath = path.join(__dirname, './public/owner_after_login.json');

            fs.writeFile(filePath, databasedata, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('JSON data has been saved to', filePath);
            });
            res.sendFile(path.join(__dirname, 'public', 'owner_after_login.html'));
        });
    });
});

app.post('/password', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    try {
        const { username, password } = req.body;

        const sql = "UPDATE registration SET password = ? WHERE username = ?";
        await mydb.query(sql, [password, username]);

        console.log("Password updated.");

        res.sendFile(path.join(__dirname, 'public', 'passwordreset.html'));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/profileupdate', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    try {
        const { name, aadhar, address, city, pincode, state, account, charge, phoneno, email, vehicle_reg, pollution, document_clear, dl_no, driving_expe } = req.body;

        const sql = "UPDATE registration SET aadhar=?, address=?, city=?, pincode=?, state=?, account=?, charge=?, phoneno=?, email=?, vehicle_reg=?, pollution=?, document_clear=?, dl_no=?, driving_expe=? WHERE name=?";
        const values = [aadhar, address, city, pincode, state, account, charge, phoneno, email, vehicle_reg, pollution, document_clear, dl_no, driving_expe, name];

        mydb.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error updating record: ", err);
                res.status(500).send("Error updating record");
                return;
            }
            console.log("Record updated.");
            res.sendFile(path.join(__dirname, 'public', 'edit_profile.html'));
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Update server error");
    }
});


app.post('/postride', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    try {
        const { name, address, aadhar, city, state, pincode, account, charge_per_unit, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_experience, ac, starting_location, ending_location, time_taken } = req.body;

        const sql = "INSERT INTO postride (name, address, aadhar, city, state, pincode, account, charge_per_unit, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_experience,ac, starting_location,ending_location,time_taken) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";

        const values = [name, address, aadhar, city, state, pincode, account, charge_per_unit, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_experience, ac, starting_location, ending_location, time_taken];


        mydb.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error inserting record: ", err);
                res.status(500).send("Error inserting record");
                return;
            }
            console.log("Record inserted.");
            res.sendFile(path.join(__dirname, 'public', 'post_ride.html'));
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error processing request");
    }
});

app.post('/bookride', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    try {
        const { name, aadhar, country, city, pincode, state, phoneno, email, ac, starting_location, ending_location, date_taken, time_taken, pin, booking_number, status, rname, raadhar, rcountry, rcity, rpincode, rstate, raccount, rcharge_per_unit, rphoneno, remail, rvehicle_reg, rpollution, rdocument_clear, rdl_no, rdriving_experience, rac, rstarting_location, rending_location, rtime_taken } = req.body;

        const sql = "INSERT INTO bookride (name, aadhar, country, city, pincode, state, phoneno, email, ac, starting_location, ending_location, date_taken, time_taken, pin, booking_number, status, rname, raadhar, rcountry, rcity, rpincode, rstate, raccount, rcharge_per_unit, rphoneno, remail, rvehicle_reg, rpollution, rdocument_clear, rdl_no, rdriving_experience, rac, rstarting_location, rending_location, rtime_taken ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const values = [name, aadhar, country, city, pincode, state, phoneno, email, ac, starting_location, ending_location, date_taken, time_taken, pin, booking_number, status, rname, raadhar, rcountry, rcity, rpincode, rstate, raccount, rcharge_per_unit, rphoneno, remail, rvehicle_reg, rpollution, rdocument_clear, rdl_no, rdriving_experience, rac, rstarting_location, rending_location, rtime_taken];

        mydb.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error inserting record: ", err);
                res.status(500).send("Error inserting record");
                return;
            }
            console.log("Record inserted.");
            res.sendFile(path.join(__dirname, 'public', 'book_ride.html'));
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error processing request");
    }
});

app.post('/confirmride', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    try {
        const { status, name } = req.body;

        const sql = "UPDATE bookride SET status=? WHERE name=?";
        const values = [status, name];

        mydb.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error updating record: ", err);
                res.status(500).send("Error updating record");
                return;
            }
            console.log("Record updated.");
            res.sendFile(path.join(__dirname, 'public', 'confirmride.html'));
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Update server error");
    }
});


app.post('/rideupdate', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    try {
        const { name, address, aadhar, city, state, pincode, account, charge_per_unit, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_experience, ac, starting_location, ending_location, time_taken } = req.body;

        const sql = "UPDATE postride SET address=?,aadhar=?,city=?,state=?,pincode=?,account=?,charge_per_unit=?,phoneno=?,email=?,vehicle_reg=?,dl_no=?,pollution=?,document_clear=?,driving_experience=?,ac=?,starting_location=?,ending_location=?,time_taken=? WHERE name=?";

        const values = [name, address, aadhar, city, state, pincode, account, charge_per_unit, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_experience, ac, starting_location, ending_location, time_taken];

        mydb.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error updating record: ", err);
                res.status(500).send("Error updating record");
                return;
            }

            console.log("Record updated.");
            res.sendFile(path.join(__dirname, 'public', 'update_ride.html'));
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Update server error");
    }
});


app.post('/showride', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    mydb.connect(function (err) {
        if (err) throw err;

        console.log("connected");

        mydb.query(" select * from postride", function (err, result) {
            if (err) throw err;

            const fs = require('fs');

            const databasedata = JSON.stringify(result);

            const filePath = path.join(__dirname, './public/showride.json');

            fs.writeFile(filePath, databasedata, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('JSON data has been saved to', filePath);
            });
            res.sendFile(path.join(__dirname, 'public', 'show_ride.html'));
        });
    });
});

app.post('/searchfun', async (req, res) => {
    try {
        var a1 = req.body.t1;
        var a2 = req.body.t2;
        var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
        con.connect(function (err) {
            if (err) throw err;
            console.log("connected");
            con.query("select * from postride where starting_location ='" + a1 + "' and ending_location ='" + a2 + "'", function (err, result) {
                const fs = require('fs');
                
                // Convert JSON data to a string
                const jsonString = JSON.stringify(result);

                // File path where you want to save the JSON data
                const filePath = 'public/search1.json';

                // Write the JSON string to the file
                fs.writeFile(filePath, jsonString, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('JSON data has been saved to', filePath);
                    
                });

                if (result.length > 0) {
                    res.redirect('/searchresult');
                } else {
                    res.redirect('/searchfun');
                }

            });
        });
        //data base code end
    } catch
    {
        res.send("Internal server error");
    }
});



app.get('/searchresult', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'searchresult.html'));
});






server.listen(3000, () => {
    console.log("Server is listening on port: 3000");
});
