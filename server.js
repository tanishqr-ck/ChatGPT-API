require("dotenv").config()
const exp=require("express")
const request =require("request")
const path = require("path")
const {engine} = require("express-handlebars")
var web=path.join(__dirname,"/web")
const app=exp()
app.use(exp.static(__dirname+"/public"))
app.use(exp.static(web))
app.get("",(req,res)=>
{
  res.render("template")
})
app.engine(
  "hbs",
  engine({
    layoutsDir: __dirname + "/views/layouts",
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      calculation: function (value) {
        return value + 100;
      },
      list: function (value, options) {
         return "<h2>" + options.fn({value: value[0]}) + "</h2";
      }
    },
  })
);
app.set("view engine","hbs")
app.get("/login",(req,res)=>
{
 var q=req.query.question;
 const options = {
  method: 'POST',
  url: 'https://openai80.p.rapidapi.com/chat/completions',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key':  process.env.API_KEY,
    'X-RapidAPI-Host': process.env.HOST
  },
  body: {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: q
      }
    ]
  },
  json: true
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

var ans=body.choices[0].message.content;
res.render("content",
{
  ans:ans
})
});


})
app.listen(3000,()=>
console.log("Server up and running")
);
