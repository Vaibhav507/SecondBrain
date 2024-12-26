import express  from "express";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from "./db";
import mongoose from "mongoose";
import { JWT_SECRET, MONGO_URL } from "./config";
import { middleware } from "./middleware";
import { z } from "zod";


const app = express();

app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {

    const requiredBody = z.object({
        username: z.string().min(3).max(10),
        password: z.string().min(8).max(20).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@\(!\)!%*#?&])/)
    })

    const parseData = requiredBody.safeParse(req.body);

    if(!parseData.success) {
        res.status(411).json({
            message: "Error in Inputs"
        })
        return;
    }

    const { username, password } = req.body;

    try {

        if(await UserModel.findOne({
            username
        })) {
            res.status(403).json({
                message: "User already exists with this username"
            })
        } else {

            await UserModel.create({
                username,
                password
            })

            res.status(200).json({
                message: "Signed up successfully"
            });

        }
        
    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        })
        
    }
 
    
})

app.post("/api/v1/signin", async (req, res) => {

    const { username, password } = req.body;

    const user = await UserModel.findOne({
        username
    })

    if(user) {

        if(user.password === password) {

            const token = jwt.sign({
                id: user._id
            }, JWT_SECRET);

            res.status(200).json({
                token: token
            })
 
        }
    }

})

app.post("/api/v1/content", middleware, async (req, res) => {
    const { link, type, title, tags } = req.body;

    await ContentModel.create({
        link,
        type,
        title,
        // @ts-ignore
        userId: req.userId,
        tags
    });

    res.json({
        message: "Content added successfully"
    });

})

app.get("/api/v1/content", middleware, async (req, res) => {
    const content = await ContentModel.find({
        // @ts-ignore
        userId: req.userId
    }).populate({
        path: "userId",
        select: "username"
    });

    res.json(content);

    

})

app.delete("/api/v1/content",middleware ,async (req, res) => {
    const { contentId } = req.body;
    await ContentModel.deleteOne({
        contentId,
        // @ts-ignore
        userId: req.userId
    })

    res.json({
        message: "Content deleted successfully"
    })

})

app.post("/api/v1/brain/share", (req, res ) => {

})

app.get("/api/v1/brain/:shareLink", (req, res) => {

})

async function  main() {
    await mongoose.connect(MONGO_URL);
    console.log("working");
    app.listen(3000);
}

main();


