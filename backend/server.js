const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes"); // Ensure correct path
const Razorpay = require("razorpay");
const crypto=require("crypto");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);

app.post("/order", async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });
        const options = req.body;
        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).send("error");
        }
        res.json(order);
    } catch {
        res.status(500).send("error");
        // console.log(error);
    }
})

app.post("/order/validate",async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} =req.body;
    const sha=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest=sha.digest("hex");
    if(digest!==razorpay_signature){
        return res.status(500).json({msg:"Trnsxtion is not legit!"})
    }
    res.json({
        msg:"sucess",
        orderId:razorpay_order_id,
        paymentId:razorpay_payment_id,
    })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

