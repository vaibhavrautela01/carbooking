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
const { Console } = require('console');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/registration', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    try {
        var a1 = req.body.name;
        var a2 = req.body.address;
        var a3 = req.body.aadhar;
        var a4 = req.body.city;
        var a5 = req.body.state;
        var a6 = req.body.pincodes;
        var a7 = req.body.account;
        var a8 = req.body.charge;

        var a9 = req.body.phoneno;
        var a10 = req.body.email;
        var a11 = req.body.vehicle_reg;
        var a12 = req.body.dl_no;
        var a13 = req.body.pollution;
        var a14 = req.body.document_clear;
        var a15 = req.body.driving_expe;
        var a16 = req.body.username;

        var a17 = req.body.password;
        var a18 = req.body.repassword;
    
       
        mydb.connect(function (err){
            if (err) throw err;
                console.log("connected");
                mydb.query("INSERT INTO registration(name, address, aadhar, city, state, pincode, account, charge, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_expe, username, password, repassword,sid,BookingId) values('" + a1 + "','" + a2 + "','" + a3 + "','" + a4 + "','" + a5 + "','" + a6 + "','" + a7 + "','" + a8 + "','" + a9 + "','" + a10 + "','" + a11 + "','" + a12 + "','" + a13 + "','" + a14 + "','" + a15 + "','" + a16 + "','" + a17 + "','" + a18 + "')",function(err, result) {
            if (err) throw err;
            console.log("Record inserted.");
            res.sendFile(path.join(__dirname, 'public', 'login2.html'));
            });
        });
    } catch (error) {
        res.send("Internal server error");
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
        const { name, address, aadhar, city, state, pincode, account, charge_per_unit, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_experience, ac, starting_location, ending_location, time_taken,sid,star } = req.body;

        const sql = "INSERT INTO postride (name, address, aadhar, city, state, pincode, account, charge_per_unit, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_experience,ac, starting_location,ending_location,time_taken,sid,star) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)";

        const values = [name, address, aadhar, city, state, pincode, account, charge_per_unit, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_experience, ac, starting_location, ending_location, time_taken,sid,star];


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
        const { name, aadhar, country, city, pincode, state, phoneno, email, ac, starting_location, ending_location, date_taken, time_taken, pin, booking_number, status, rname, raadhar, rcountry, rcity, rpincode, rstate, raccount, rcharge_per_unit, rphoneno, remail, rvehicle_reg, rpollution, rdocument_clear, rdl_no, rdriving_experience, rac, rstarting_location, rending_location, rtime_taken} = req.body;

        const sql = "INSERT INTO bookride (name, aadhar, country, city, pincode, state, phoneno, email, ac, starting_location, ending_location, date_taken, time_taken, pin, booking_number, status, rname, raadhar, rcountry, rcity, rpincode, rstate, raccount, rcharge_per_unit, rphoneno, remail, rvehicle_reg, rpollution, rdocument_clear, rdl_no, rdriving_experience, rac, rstarting_location, rending_location, rtime_take) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";

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
        const {name, startingpoint, endingpoint, aadhar, phoneno, accountno, charge, date , BookingId, sid ,CustomerId } = req.body;

        const sql = "UPDATE booking SET name=?, startingpoint=?, endingpoint=?, aadhar=?, phoneno=?, accountno=?, charge=?, date=? , sid=?,CustomerId=? WHERE   BookingId=?";

        const values = [name, startingpoint, endingpoint, aadhar, phoneno, accountno, charge, date , BookingId, sid ,CustomerId];

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
            if (err) 
                res.sendFile(path.join(__dirname, 'public', 'aaa.html'));

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



app.post('/showbooking', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    var a1= "Pending";

    mydb.connect(function (err) {
        if (err) throw err;

        console.log("connected");

        mydb.query(" select * from booking where status='"+a1+"'", function (err, result) {
            if (err) throw err;

            const fs = require('fs');

            const databasedata = JSON.stringify(result);

            const filePath = path.join(__dirname, './public/writeshow.json');

            fs.writeFile(filePath, databasedata, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('JSON data has been saved to', filePath);
            });
            res.sendFile(path.join(__dirname, 'public', 'showbooking.html'));
        });
    });
});




app.post('/updatebookingstatus', async (req, res) => {
    try {
        var a = req.body.BookingId;
        var b = req.body.sid;
        var c = req.body.status;
        
        
        var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
        con.connect(function (err) {
            if (err) throw err;
            console.log("connected");
            con.query(" update booking set status='" + c + "' where BookingId='" + a + "' and sid='" + b + "'", function (err, result) {
                if (err) throw err;
                console.log("Database Updated");
                
            });
        });
        //data base code end
        res.sendFile(path.join(__dirname, 'public', 'mybookingstatus.html'));
    }
     catch {
         res.send("Internal server error");
        }
    });
    
    
    // 
    
    app.post('/mybookingstatus', async (req, res) => {
        try {
            var a1 = req.body.status;
            var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
            con.connect(function (err) {
                if (err) throw err;
                console.log("connected");
                con.query("select * from booking where status='" + a1 + "'", function (err, result) {
                    const fs = require('fs');
                    
                    // Convert JSON data to a string
                    const jsonString = JSON.stringify(result);
                    
                    // File path where you want to save the JSON data
                    const filePath = 'public/mybookingstatus.json';
                    
                    // Write the JSON string to the file
                    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
                        if (err) {
                            console.error('Error writing file:', err);
                            return;
                        }
                        console.log('JSON data has been saved to', filePath);
                        
                    });
                    
                    res.sendFile(path.join(__dirname, 'public', 'mybookingstatus.html'));
                    
                    
                });
            });
            //data base code end
        } catch
        {
            res.send("Internal server error");
        }
    });
    
    app.post('/clregistration', async (req, res) => {
        var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
        
        try {
            var a1 = req.body.name;
            var a2 = req.body.address;
            var a3 = req.body.aadhar;
            var a4 = req.body.city;
            var a5 = req.body.state;
            var a6 = req.body.pincodes;
            var a7 = req.body.account;
            var a8 = req.body.charge;
            
            var a9 = req.body.phoneno;
        var a10 = req.body.email;
        var a11 = req.body.vehicle_reg;
        var a12 = req.body.dl_no;
        var a13 = req.body.pollution;
        var a14 = req.body.document_clear;
        var a15 = req.body.driving_expe;
        var a16 = req.body.username;
        
        var a17 = req.body.password;
        var a18 = req.body.repassword;
        var a19 = req.body.sid;
        var a20 = req.body.BookingId;
        
        mydb.connect(function (err){
            if (err) throw err;
            console.log("connected");
            mydb.query("INSERT INTO clregistration(name, address, aadhar, city, state, pincode, account, charge, phoneno, email, vehicle_reg, dl_no, pollution, document_clear, driving_expe, username, password, repassword,sid,BookingId) values('" + a1 + "','" + a2 + "','" + a3 + "','" + a4 + "','" + a5 + "','" + a6 + "','" + a7 + "','" + a8 + "','" + a9 + "','" + a10 + "','" + a11 + "','" + a12 + "','" + a13 + "','" + a14 + "','" + a15 + "','" + a16 + "','" + a17 + "','" + a18 + "','" + a19 + "','" + a20 + "')",function(err, result) {
                if (err) throw err;
                console.log("Record inserted.");
                res.sendFile(path.join(__dirname, 'public', 'login2.html'));
            });
        });
    } catch (error) {
        res.send("Internal server error");
    }
});




app.post('/clientlogin', (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
    
    var a1 = req.body.username;
    var a2 = req.body.password;
    
    mydb.query ( "SELECT * FROM clregistration WHERE username='" + a1 + "' and password='" + a2 + "'",function(err, result) {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).send('Internal Server Error');
        }
        
        const fs = require('fs');
        
        const databasedata = JSON.stringify(result);
        
        const filePath = path.join(__dirname, './public/profile.json');
        
        fs.writeFile(filePath, databasedata, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('JSON data has been saved to', filePath);
        });
        
        if (result.length > 0) {
            res.redirect('/access');
        } else {
            res.redirect('/unaccess');
        }
    });
});





app.get('/access', (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    mydb.connect(function (err) {
        if (err) throw err;
        
        console.log("connected");
        
        mydb.query(" select * from clregistration", function (err, result) {
            if (err) throw err;
            
            const fs = require('fs');
            
            const databasedata = JSON.stringify(result);
            
            const filePath = path.join(__dirname, './public/profile.json');
            
            fs.writeFile(filePath, databasedata, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('JSON data has been saved to', filePath);
            });
            res.sendFile(path.join(__dirname, 'public', 'dashboard2.html'));
        });
    });
    
    
    
});

app.get('/unaccess', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login2.html'));
});



app.post('/clientprofileupdate', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
    
    try {
        const { name, aadhar, address, city, pincode, state, account, phoneno, email,sid,BookingId } = req.body;
        
        const sql = "UPDATE clregistration SET aadhar=?, address=?, city=?, pincode=?, state=?, account=?, phoneno=?, email=?, sid=?, BookingId=? WHERE name=?";
        const values = [aadhar, address, city, pincode, state, account, phoneno, email, sid, BookingId, name];
        
        mydb.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error updating record: ", err);
                res.status(500).send("Error updating record");
                return;
            }
            console.log("Record updated.");
            res.sendFile(path.join(__dirname, 'public', 'clienteditprofile.html'));
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Update server error");
    }
});



app.post('/book', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    try {
        const {  name, startingpoint, endingpoint, aadhar, phoneno, accountno, charge, date , BookingId, sid, status,CustomerId,lat,lon,accuracy } = req.body;

        const sql = "INSERT INTO booking(name, startingpoint, endingpoint, aadhar, phoneno, accountno, charge, date , BookingId, sid, status,CustomerId,lat,lon,accuracy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)";

        const values = [name, startingpoint, endingpoint, aadhar,  phoneno, accountno, charge, date , BookingId, sid, status, CustomerId,lat,lon,accuracy];

        mydb.query(sql, values,  function (err, result){
            if (err) {
                console.error("Error inserting record: ", err);
                res.status(500).send("Error inserting record");
                return;
            }
            console.log("Record inserted.");

            if (result.length > 0) {
                res.redirect('/geo');
            } else {
                res.redirect('/ungeo');
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error processing request");
    }
});

app.get('/geo', (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    mydb.connect(function (err) {
        if (err) throw err;
        
        console.log("connected");
        
        mydb.query(" select * from booking", function (err, result) {
            if (err) throw err;
            
            const fs = require('fs');
            
            const databasedata = JSON.stringify(result);
            
            const filePath = path.join(__dirname, './public/geo.json');
            
            fs.writeFile(filePath, databasedata, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('JSON data has been saved to', filePath);
            });
            res.sendFile(path.join(__dirname, 'public', 'dashboard2.html'));
        });
    });
    
});


app.get('/ungeo', (req, res) => {

    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    mydb.connect(function (err) {
        if (err) throw err;
        
        console.log("connected");
        
        mydb.query(" select * from booking", function (err, result) {
            if (err) throw err;
            
            const fs = require('fs');
            
            const databasedata = JSON.stringify(result);
            
            const filePath = path.join(__dirname, './public/geo.json');
            
            fs.writeFile(filePath, databasedata, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('JSON data has been saved to', filePath);
            });
            res.sendFile(path.join(__dirname, 'public', 'dashboard2.html'));
        });
    });});







app.post('/myride', async (req, res) => {
    try {
        var a1 = req.body.CustomerId;
        var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
        con.connect(function (err) {
            if (err) throw err;
            console.log("connected");
            con.query("select * from booking where CustomerId ='" + a1 + "'", function (err, result) {
                const fs = require('fs');
                
                // Convert JSON data to a string
                const jsonString = JSON.stringify(result);
                
                // File path where you want to save the JSON data
                const filePath = 'public/myride.json';
                
                // Write the JSON string to the file
                fs.writeFile(filePath, jsonString, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('JSON data has been saved to', filePath);
                    
                });
                res.sendFile(path.join(__dirname, 'public', 'myride2.html'));
            });
        });
        //data base code end
    } catch
    {
        res.send("Internal server error");
    }
});

app.post('/mybooking', async (req, res) => {
    try {
        var a1 = req.body.CustomerId;
        var a2 = "booked";

        var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
        con.connect(function (err) {
            if (err) throw err;
            console.log("connected");
            con.query("select * from booking where CustomerId ='" + a1 + "' AND status='"+a2+"'", function (err, result) {
                const fs = require('fs');
                
                // Convert JSON data to a string
                const jsonString = JSON.stringify(result);
                
                // File path where you want to save the JSON data
                const filePath = 'public/mybooking.json';
                
                // Write the JSON string to the file
                fs.writeFile(filePath, jsonString, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('JSON data has been saved to', filePath);
                    
                });
                res.sendFile(path.join(__dirname, 'public', 'mybooking2.html'));
            });
        });
        //data base code end
    } catch
    {
        res.send("Internal server error");
    }
});

app.get('/cancel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'comfirmcancel.html'));
});




app.post('/comfirmcancel', async (req, res) => {

    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
    
    try {
        var a1 = req.body.BookingId;
        var a2 = "Cancel";

        
        const sql = "UPDATE booking SET status='"+a2+"' WHERE  BookingId='"+a1+"'";
        
    
        mydb.query(sql, (err, result) => {
            if (err) {
                console.error("Error updating record: ", err);
                res.status(500).send("Error updating record");
                return;
            }
            console.log("Record updated.");
            res.sendFile(path.join(__dirname, 'public', 'dashboard2.html'));
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Update server error");
    }
});




app.post('/showcancel', async (req, res) => {
    try {
        var a1 = req.body.CustomerId;
        var a2 = "Cancel";

        var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
        con.connect(function (err) {
            if (err) throw err;
            console.log("connected");
            con.query("select * from booking where CustomerId ='" + a1 + "' AND status='"+a2+"'", function (err, result) {
                const fs = require('fs');
                
                // Convert JSON data to a string
                const jsonString = JSON.stringify(result);
                
                // File path where you want to save the JSON data
                const filePath = 'public/cancel.json';
                
                // Write the JSON string to the file
                fs.writeFile(filePath, jsonString, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('JSON data has been saved to', filePath);
                    
                });
                res.sendFile(path.join(__dirname, 'public', 'cancel2.html'));
            });
        });
        //data base code end
    } catch
    {
        res.send("Internal server error");
    }
});

app.post('/updatepostride', async (req, res) => {
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
            res.sendFile(path.join(__dirname, 'public', 'updatepostride.html'));
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Update server error");
    }
});




app.post('/rating', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    try {
        var a1 = req.body.name;
        var a2 = req.body.CustomerId;
        var a3 = req.body.RiderId;
        var a4 = req.body.date;
        var a5 = req.body.BookingId;
        var a6 = req.body.rate;

    
        mydb.connect(function (err){
            if (err) throw err;
                console.log("connected");
                mydb.query("INSERT INTO rating(name, CustomerId, RiderId, date, BookingId, rate) values('" + a1 + "','" + a2 + "','" + a3 + "','" + a4 + "','" + a5 + "','" + a6 + "')",function(err, result) {
            if (err) throw err;
            console.log("Record inserted.");

            if (result.length > 0) {
                res.redirect('/b');
            } else {
                res.redirect('/a');
            }

            });
        });
    } catch (error) {
        res.send("Internal server error");
    }
});



app.get('/a', async (req, res) => {

    try {
        var a1 =1;

        var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
        con.connect(function (err) {
            if (err) throw err;
            console.log("connected");
            con.query("select * from rating where RiderId ='" + a1 + "'", function (err, result) {
                const fs = require('fs');
                
                // Convert JSON data to a string
                const jsonString = JSON.stringify(result);
                
                // File path where you want to save the JSON data
                const filePath = 'public/feedback.json';
                
                // Write the JSON string to the file
                fs.writeFile(filePath, jsonString, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('JSON data has been saved to', filePath);
                    
                });
                res.sendFile(path.join(__dirname, 'public', 'rating2.html'));
            });
        });
        //data base code end
    } catch
    {
        res.send("Internal server error");
    }
});

app.get('/b', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rating.html'));
});







app.post('/rating2', async (req, res) => {

   const path = require('path');
   const fs = require('fs');

// Construct the absolute path to the JSON file
const filePath = path.resolve(__dirname, 'public/feedback.json');

// Read the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Parse the JSON data
    let jsonData = JSON.parse(data);

    // Calculate the average rate
    let total = 0;
    let count = jsonData.length;

    for (let i = 0; i < count; i++) {
        total = total + parseFloat(jsonData[i].rate);  // Convert the rate to a float
    };

    const avg = total / count;
    var a=1;

    var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
    con.connect(function (err) {
        if (err) throw err;
            console.log("connected");
    con.query(" update postride set star='" + avg + "' where sid='" + a + "'", function (err, result) {
                if (err) throw err;
                console.log("Database Updated");
                
            });
        });
        res.sendFile(path.join(__dirname, 'public', 'owner_after_login.html'));


    
  
    // res.redirect('/star');
   

});

});




// app.get('/star', async (req, res) => {

//         try {
//             var a1 =1;
    
//             var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
//             con.connect(function (err) {
//                 if (err) throw err;
//                 console.log("connected");
//                 con.query("select * from rating where RiderId ='" + a1 + "'", function (err, result) {
//                     const fs = require('fs');
                    
//                     // Convert JSON data to a string
//                     const jsonString = JSON.stringify(result);
                    
//                     // File path where you want to save the JSON data
//                     const filePath = 'public/star.json';
                    
//                     // Write the JSON string to the file
//                     fs.writeFile(filePath, jsonString, 'utf8', (err) => {
//                         if (err) {
//                             console.error('Error writing file:', err);
//                             return;
//                         }
//                         console.log('JSON data has been saved to', filePath);
                        
//                     });
//                     res.sendFile(path.join(__dirname, 'public', 'rating.html'));
//                 });
//             });
//             //data base code end
//         } catch
//         {
//             res.send("Internal server error");
//         }
// });

app.post('/mltime', async (req, res) => {
    var mydb = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });

    try {
        var a1 = req.body.name;
        var a2 = req.body.CustomerId;
        var a3 = req.body.RiderId;
        var a4 = req.body.date;
        var a5 = req.body.BookingId;
        var a6 = req.body.traveltime;

    
        mydb.connect(function (err){
            if (err) throw err;
                console.log("connected");
                mydb.query("INSERT INTO time(name, CustomerId, RiderId, date, BookingId, time) values('" + a1 + "','" + a2 + "','" + a3 + "','" + a4 + "','" + a5 + "','" + a6 + "')",function(err, result) {
            if (err) throw err;
            console.log("Record inserted.");

            if (result.length > 0) {
                res.redirect('/ml');
            } else {
                res.redirect('/mltime2');
            }
            });
        });
    } catch (error) {
        res.send("Internal server error");
    }
});



app.get('/mltime2', async (req, res) => {

    try {
        var a1 =1;

        var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
        con.connect(function (err) {
            if (err) throw err;
            console.log("connected");
            con.query("select * from time where RiderId ='" + a1 + "'", function (err, result) {
                const fs = require('fs');
                
                // Convert JSON data to a string
                const jsonString = JSON.stringify(result);
                
                // File path where you want to save the JSON data
                const filePath = 'public/time.json';
                
                // Write the JSON string to the file
                fs.writeFile(filePath, jsonString, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('JSON data has been saved to', filePath);
                    
                });
                res.sendFile(path.join(__dirname, 'public', 'time2.html'));
            });
        });
        //data base code end
    } catch
    {
        res.send("Internal server error");
    }
});



// app.post('/r', async (req, res) => {

//     const path = require('path');
//     const fs = require('fs');
 
//  // Construct the absolute path to the JSON file
//  const filePath = path.resolve(__dirname, 'public/time.json');
 
//  // Read the JSON file
//  fs.readFile(filePath, 'utf8', (err, data) => {
//      if (err) {
//          console.error('Error reading the file:', err);
//          return;
//      }
 
//      // Parse the JSON data
//      let jsonData = JSON.parse(data);
 
//      // Calculate the average rate
//      let total = 0;
//      let count = jsonData.length;
 
//      for (let i = 0; i < count; i++) {
//          total = total + parseFloat(jsonData[i].time);  // Convert the rate to a float
//          console.log(total);
//      };
 
//      const avg = total / count;
//      var a =1;
 
//       var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
//       con.connect(function (err) {
//           if (err) throw err;
//               console.log("connected");
//       con.query(" update postride set time='" + avg + "' where sid='" + a + "'", function (err, result) {
//                   if (err) throw err;
//                   console.log("Database Updated");
                 
//               });
//           });
//     console.log("AVERAGE TIME"+avg);
//      res.sendFile(path.join(__dirname, 'public', 'owner_after_login.html'));
 
   
//      // res.redirect('/star');
 
//  });
 
//  });

app.post('/r', async (req, res) => {

    const path = require('path');
    const fs = require('fs');
 
 // Construct the absolute path to the JSON file
 const filePath = path.resolve(__dirname, 'public/time.json');
 
 // Read the JSON file
 fs.readFile(filePath, 'utf8', (err, data) => {
     if (err) {
         console.error('Error reading the file:', err);
         return;
     }
 
     // Parse the JSON data
     let jsonData = JSON.parse(data);
 
     // Calculate the average rate
     let total = 0;
     let count = jsonData.length;
 
     for (let i = 0; i < count; i++) {
         total = total + parseFloat(jsonData[i].time);  // Convert the rate to a float
     };
 
     const avg = total / count;
     let p=Math.round(avg);
     var a=1;
 
     var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
     con.connect(function (err) {
         if (err) throw err;
             console.log("connected");
     con.query(" update postride set time='" + p + "' where sid='" + a + "'", function (err, result) {
                 if (err) throw err;
                 console.log("Database Updated");
                 
             });
         });

         res.sendFile(path.join(__dirname, 'public', 'owner_after_login.html'));
 
 
     
   
     // res.redirect('/star');
    
 
 });
 
 });

 app.post('/continue', async (req, res) => {

    var a1 = req.body.distance;
    var a2 = req.body.time;
    var a = req.body.riderid;



    let speed=a1/a2;
    

    var con = mysql.createConnection({ host: "localhost", user: "root", password: "root123", database: "liftlink" });
    con.connect(function (err) {
        if (err) throw err;
            console.log("connected");
    con.query(" update postride set speed='" + speed+ "' where sid='" + a + "'", function (err, result) {
                if (err) throw err;
                console.log("Database Updated");
                
            });
        });


    res.sendFile(path.join(__dirname, 'public', 'owner_after_login.html'));
 
 
     
   
});
 





server.listen(3000, () => {
    console.log("Server is listening on port: 3000");
});
