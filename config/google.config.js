import googleOAuth from "passport-google-oauth20";

import { UserModel } from "../database/allModels";


const GoogleStrategy = googleOAuth.Strategy;

export default (passport) => {
    passport.use(
        new GoogleStrategy({
            clientID: "481989928677-g563ek8dfv4vte70up5mf70e06ems8un.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:4000/auth/google/callback"
        },
        async(accessToken, refreshToken, profile, done) => {
            //creating new user
            const newUser = {
                fullname: profile.displayName,
                email: profile.emails[0].value,
                profilePic: profile.photos[0].value
            };
            try{
                //check whether user exist or not
                const user = await UserModel.findOne({email: newUser.email});
                
                if(user) {

                    //generating jwt token
                    const token = user.generateJwtToken();

                    //return user
                    done(null, {user, token});
                } else{
                    //create a new user
                    const user = await UserModel.create(newuser);

                    //generating the jwt token
                    const token = user.generateJwtToken();

                    //return user
                    done(null, {user, token});
                }
            } catch(error) {
               done(error, null);
            }
   }
    )
    );
    passport.serializeUse((userData,done) => done(null, {...userData}));
    passport.deserializeUser((id, done) => done(null, id));
};



