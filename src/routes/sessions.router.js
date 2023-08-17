import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', {failureREdirect:'/failregister'}), async (req, res) =>{
    res.send({status:"success", message:"User registered"});
});

router.get('/failregister', async (req, res) => {
    console.log("Failed strategy");
    res.send({error:"Error ocurred when try to register"});
})

router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin'}), async (req,res)=>{
    if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'});

    req.session.user = {
        name: req.user.first_name,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart,
        role: req.user.role
    }

    console.log("req.session.user: ");
    console.log(req.session.user); //Todo OK
    console.log("req.user: ");
    console.log(req.user); //Todo OK

    res.send({status:"success", payload:req.session.user, message:"Login!!!"})

});

router.get('/faillogin', async (req, res)=>{

    console.log('Failed strategy');
    res.send({error: 'Error ocurred when try to login...'});

});

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"Couldn't close session"});
        res.redirect('/login');
    })
});

router.get('/github', passport.authenticate('github'), async (req,res)=>{});

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async (req,res)=>{
    req.session.user = req.user;
    res.redirect('/')
});

router.get('/current', (req, res) => {
    //console.log("req.user: "+ req.user);
    //console.log("req.session.user: "+ req.session.user);

    if(!req.session.user) return res.status(400).send({status:"error", error: 'No user currently'});
    
    res.send({status:"success", payload:req.session.user, message:"Current user!!!"})
});

export default router;