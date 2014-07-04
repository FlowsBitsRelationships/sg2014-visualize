sg2014-visualize
================

Angular app for data visualization.

### Set the Environment Variables
Set environment variables DB_USERNAME and DB_PASSWORD

### Install Dependencies

Install [/Ruby 2.X.X/](https://www.ruby-lang.org/en/downloads/). then install the Sinatra gem
```
gem install sinatra
gem install json
```
Run the node package manager to install the angular dependencies
```
cd sg2014-visualize
npm install
```

### Run the Application

Run the sinatra_app
(ed note: Perhaps these routes could be moved to the node app that angular uses, removing the ruby dependency?)

```
cd app
ruby sinatra_app.rb
```

Open Chrome and go to [/localhost:1111/](http://localhost:1111/)
