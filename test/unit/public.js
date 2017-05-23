var _ = require("underscore")
var fs = require("fs")
var path = require("path")
var sinon = require("sinon")
var should = require("should")
var Readable = require("stream").Readable
var request = require("supertest")
var zlib = require("zlib")
var http2 = require("http2")

var api = require(__dirname + "/../../dadi/lib/api")
var Bearer = require(__dirname + "/../../dadi/lib/auth/bearer")
var Controller = require(__dirname + "/../../dadi/lib/controller")
var Datasource = require(__dirname + "/../../dadi/lib/datasource")
var help = require(__dirname + "/../../dadi/lib/help")
var Page = require(__dirname + "/../../dadi/lib/page")
var apiProvider = require(__dirname + "/../../dadi/lib/providers/dadiapi")
var remoteProvider = require(__dirname + "/../../dadi/lib/providers/remote")
var Server = require(__dirname + "/../../dadi/lib")
var TestHelper = require(__dirname + "/../help")()
var twitterProvider = require(__dirname + "/../../dadi/lib/providers/twitter")
var wordpressProvider = require(__dirname +
  "/../../dadi/lib/providers/wordpress")
var markdownProvider = require(__dirname + "/../../dadi/lib/providers/markdown")

var config = require(path.resolve(path.join(__dirname, "/../../config")))
var controller

// Ignore errors around self-assigned SSL certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

describe("Public folder", function(done) {
  beforeEach(function(done) {
    TestHelper.resetConfig().then(() => {
      TestHelper.disableApiConfig().then(() => {
        done()
      })
    })
  })

  afterEach(function(done) {
    TestHelper.stopServer(done)
  })

  it("should return files from the public folder", function(done) {
    TestHelper.disableApiConfig().then(() => {
      TestHelper.updateConfig({ allowJsonView: true }).then(() => {
        var pages = TestHelper.setUpPages()

        TestHelper.startServer(pages).then(() => {
          var connectionString =
            "http://" +
            config.get("server.host") +
            ":" +
            config.get("server.port")
          var client = request(connectionString)

          client.get("/image.png").end((err, res) => {
            should.exist(res.headers["content-type"])
            res.headers["content-type"].should.eql("image/png")
            res.headers["cache-control"].should.eql("public, max-age=86400")
            done()
          })
        })
      })
    })
  })

  it("should not compress images in the public folder", function(done) {
    TestHelper.disableApiConfig().then(() => {
      TestHelper.updateConfig({ allowJsonView: true }).then(() => {
        var pages = TestHelper.setUpPages()

        TestHelper.startServer(pages).then(() => {
          var connectionString =
            "http://" +
            config.get("server.host") +
            ":" +
            config.get("server.port")
          var client = request(connectionString)

          client.get("/image.png").end((err, res) => {
            should.not.exist(res.headers["content-encoding"])
            done()
          })
        })
      })
    })
  })

  it("should gzip appropiate files served from the public folder by default", function(
    done
  ) {
    TestHelper.disableApiConfig().then(() => {
      TestHelper.updateConfig({ allowJsonView: true }).then(() => {
        var pages = TestHelper.setUpPages()

        TestHelper.startServer(pages).then(() => {
          var connectionString =
            "http://" +
            config.get("server.host") +
            ":" +
            config.get("server.port")
          var client = request(connectionString)

          client.get("/gzipme.css").end((err, res) => {
            res.headers["content-encoding"].should.eql("gzip")
            res.text.should.eql("hello world!")
            done()
          })
        })
      })
    })
  })

  it("should push assets over http2 when supported and defined in the globalPushManifest", function(
    done
  ) {
    var pages = TestHelper.setUpPages()
    var secureClientHost =
      "https://" + config.get("server.host") + ":" + config.get("server.port")

    var configUpdate = {
      server: {
        protocol: "https",
        sslPrivateKeyPath: "test/ssl/unprotected/key.pem",
        sslCertificatePath: "test/ssl/unprotected/cert.pem"
      },
      globalPushManifest: ["/image.png"]
    }

    TestHelper.updateConfig(configUpdate).then(() => {
      TestHelper.startServer(pages).then(() => {
        var request = http2.get(secureClientHost + "/test")

        request.on("push", function(promise) {
          promise.url.should.equal("/image.png")
          promise.on("response", function(pushStream) {
            pushStream.on("data", function(data) {
              done()
            })
          })
        })
      })
    })
  })
})
