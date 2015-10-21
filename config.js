var convict = require('convict');

// Define a schema
var conf = convict({
  app: {
    name: {
      doc: "The applicaton name",
      format: String,
      default: "Bantam (Rosecomb)"
    }
  },
	server: {
    host: {
      doc: "Rosecomb IP address",
      format: '*',
      default: '0.0.0.0'
    },
    port: {
      doc: "port to bind",
      format: 'port',
      default: 8080
    }
  },
	api: {
    host: {
      doc: "Serama IP address",
      format: '*',
      default: '0.0.0.0'
    },
    port: {
      doc: "port to bind",
      format: 'port',
      default: 8080
    }
  },
  auth: {
  	tokenUrl: {
      doc: "",
      format: String,
      default: "/token"
    },
    clientId: {
      doc: "",
      format: String,
      default: "rosecombClient"
    },
    secret: {
      doc: "",
      format: String,
      default: "superSecret"
    }
  },
  caching: {
    ttl: {
      doc: "",
      format: Number,
      default: 300
    },
    directory: {
      enabled: {
        doc: "",
        format: Boolean,
        default: true
      },
      path: {
        doc: "",
        format: String,
        default: "./cache/rosecomb"
      },
      extension: {
        doc: "",
        format: String,
        default: "html"
      }
    },
    redis: {
      enabled: {
        doc: "",
        format: Boolean,
        default: false
      },
      host: {
        doc: "",
        format: String,
        default: "tresting.qvhlji.ng.0001.euw1.cache.amazonaws.com"
      },
      port: {
        doc: "port to bind",
        format: 'port',
        default: 6379
      },
      password: {
        doc: "",
        format: String,
        default: ""
      }
    }
  },
  dust: {
  	cache: {
      doc: "Determines if Dust caching is enabled",
      format: Boolean,
      default: true
    },
    debug: {
      doc: "",
      format: Boolean,
      default: true
    },
    debugLevel: {
      doc: "",
      format: String,
      default: "DEBUG"
    },
    whitespace: {
      doc: "",
      format: Boolean,
      default: false
    }
  },
  logging: {
  	enabled: {
      doc: "Determines if logging is enabled",
      format: Boolean,
      default: true
    },
    level: {
      doc: "",
      format: String,
      default: "DEBUG"
    },
    path: {
      doc: "",
      format: String,
      default: "./log"
    },
    filename: {
      doc: "",
      format: String,
      default: "rosecomb"
    },
    dateFormat: {
      doc: "",
      format: String,
      default: ""
    },
    extension: {
      doc: "",
      format: String,
      default: "log"
    },
    messageFormat: {
      doc: "",
      format: String,
      default: "<%= label %> - <%= date %> - <%= message %>"
    }
  },
  rewrites: {
    datasource: {
      doc: "",
      format: String,
      default: ""
    },
    path: {
      doc: "",
      format: String,
      default: "workspace/routes/rewrites.txt"
    }
  },
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test", "qa"],
    default: "development",
    env: "NODE_ENV",
    arg: "node_env"
  }
});

// Load environment dependent configuration
var env = conf.get('env');
conf.loadFile('./config/config.' + env + '.json');

// Perform validation
conf.validate({strict: false});

module.exports = conf;