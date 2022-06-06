const mongoose = require('mongoose');
const Article = require('./../app/models/article');

const should = require('chai').should();

process.env.NODE_ENV = 'test';
const config = require('config');


describe('database tests' , () => {

    let DataArticle = {
        title : 'article one',
        author : 'hesam mousavi',
        body : 'this is article one',
        tags : 'article1,article2'
    }

    before(() => {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.DBHost , { useNewUrlParser : true});    
    })

    it('check connection' , (done) => {
        mongoose.connection
            .once('open' , () => done())
            .on('error' , (err) => {
                console.log(err);
            });
    });


    it('save a article' , async () => {
        
        let article = new Article(DataArticle);

        article = await article.save();

        article.should.be.a('object');
        article.should.have.property('title');
        article.should.have.property('author');
        article.should.have.property('body');
        article.should.have.property('tags');
    });

    it('find all articles' , async () => {
        let articles = await Article.find({});

        articles.should.be.a('array');
        articles.length.should.be.deep.eql(1);
    });

    it('find a article' , async () => {
        let article = await Article.findOne({ title : DataArticle.title });

        article.title.should.be.eql(DataArticle.title);
        article.body.should.be.eql(DataArticle.body);
        article.author.should.be.eql(DataArticle.author);
        article.tags.should.be.eql(DataArticle.tags);
    });

    it('update a article' , async () => {
        let article = await Article.findOne({ title : DataArticle.title});

        article.set({
            'title' : 'article two'
        });

        let result = await article.save();

        result.should.be.a('object');
        result.should.have.property('title');
        result.title.should.be.eql('article two');
    });


    it('remove all article' , async () => {
        let result = await Article.deleteMany({});

        result.should.have.property('ok');
        result.ok.should.be.eql(1);
    });

    after('close db connection',() => {
        mongoose.connection.close();
    })
})