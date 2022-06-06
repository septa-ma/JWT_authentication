process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Article = require('./../app/models/article');

let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
let server = require('./../server');

chai.use(chaiHttp);

describe('Article Routes' , () => {

    let DataArticle = {
        title : 'article one',
        author : 'hesam mousavi',
        body : 'this is article one',
        tags : 'article1,article2'
    }

    describe('/POST article' , () => {
        it('it should not POST a article without title feild' , done => {
            
            let article = {
                author : 'hesam mousavi',
                body : 'this is article one',
                tags : 'article1,article2'
            }

            chai.request(server)
            .post('/api/article')
            .send(article)
            .end((err , res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('title');
                res.body.errors.title.should.have.property('kind').eql('required');
                done();
            })

        })

        it('it should POST a article' , done => {
            chai.request(server)
            .post('/api/article')
            .send(DataArticle)
            .end((err , res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Article successfully added!');
                res.body.article.should.have.property('title');
                res.body.article.should.have.property('author');
                res.body.article.should.have.property('body');
                res.body.article.should.have.property('tags');
                done();
            })
        })
    });

    describe('/GET article' , () => {
        it('it should GET all the articles' , done => {
            chai.request(server)
                .get('/api/article')
                .end((err , res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);

                    done();
                })
        })
    })

    describe('/GET/:id article' , () => {

        it('it should GET a article by the given id' ,  done => {
            let article = new Article(DataArticle);
            article.save((err , article) => {

                chai.request(server)
                    .get('/api/article/' + article.id)
                    .end((err , res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title');
                        res.body.should.have.property('author');
                        res.body.should.have.property('body');
                        res.body.should.have.property('tags');
                        res.body.should.have.property('_id').eql(article.id);

                        done()
                    })

            })
        })

    })

    describe('/PUT/:id article' , () => {
        it('it should UPDATE a article given the id' , done => {
            let article = new Article(DataArticle);
            article.save((err , article) => {
                chai.request(server)
                    .put('/api/article/' + article.id)
                    .send({ title : 'article two' , author : 'Ahmadi'})
                    .end((err , res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Article updated!');
                        res.body.result.should.have.property('title').eql('article two');

                        done();
                    })
            })
        })
    })

    describe('/DELETE/:id article' , () => {
        it('it should DELETE a article given the id' , done => {
            let article = new Article(DataArticle);
            article.save((err , article) => {
                chai.request(server)
                    .delete('/api/article/' + article.id)
                    .send({ title : 'article two' , author : 'Ahmadi'})
                    .end((err , res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Article successfully deleted!');
                        res.body.result.should.have.property('ok').eql(1);

                        done();
                    })
            })
        })
    })


    after(async () => {
        await Article.deleteMany({});
    })
});