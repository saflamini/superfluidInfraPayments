const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers } = require("ethers");

// Ethers.js provider initialization
const url = "https://eth-kovan.alchemyapi.io/v2/D5mZn4gVHMiQUIMSKn1HDXAoHfjnn48P";
const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
let sf;
async function setFramework() {
    sf = await Framework.create({
        networkName: "kovan",
        provider: customHttpProvider
    });
}
setFramework();

//middleware
app.use(cors());
app.use(express.json());

//ROUTES

//will start w simple get request that will only return 200 if user is authenticated
//(i.e. streaming to correct address);

function keyGen() {
    return Math.floor(Math.random() * 1000000);
}

app.post("/create-account", async (req, res) => {
    try {
        let key = keyGen();
        const { address } = req.body;
        console.log(req.body)
        const newUser = await pool.query(
            "INSERT INTO auth (useraddress, userkey) VALUES($1, $2)",
            [address, key]
        );
        res.json(newUser);
    } catch (error) {
        console.error(error);
    }
})

app.post("/authenticate", async (req, res) => {
    try {
        const { userkey } = req.body;

        const user = await pool.query("SELECT * FROM auth WHERE userkey = $1", [userkey]);
        if (user.rows[0] === undefined) {
            res.status(401);
            res.send("API Key Does Not Exist");
        }
        const address = user.rows[0].useraddress;
        const flow = await sf.cfaV1.getFlow({
            superToken: "0xe3CB950Cb164a31C66e32c320A800D477019DCFF",
            sender: address,
            receiver: "0x5966aa11c794893774a382d9a19743B8be6BFFd1",
            providerOrSigner: customHttpProvider
        });
        if (flow.flowRate === '0') {
            res.status(401);
            res.send("Not authorized - no payment received");
            console.log("You are not authorized to use this service. Please sign up or contact support")
        }
        else {
            res.status(200);
            res.send("Hello sir");
            console.log("welcome ser")
        }
    } catch (error) {
        console.error(error.message);
    }
})

app.listen(5000, () => {
    console.log("server started on port 5000");

})