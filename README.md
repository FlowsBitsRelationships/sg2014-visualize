sg2014-visualize
================

Angular app for data visualization.

### Install Dependencies

Install Ruby, then install the Sinatra gem
```
gem install sinatra

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
