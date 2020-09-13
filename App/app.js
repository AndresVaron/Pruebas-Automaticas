const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const busboy = require('connect-busboy');
const formData = require('express-form-data');
const os = require('os');
const indexRouter = require('./routes/index');
const app = express();

app.use(
    logger(
        '[:date[clf]] - ":method :url HTTP/:http-version" - :status :res[content-length] ":referrer" ":user-agent" - :remote-addr :remote-user \n'
    )
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(busboy());
app.use(
    formData.parse({
        uploadDir: os.tmpdir(),
        autoClean: true,
    })
);
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());
app.use('/api/', indexRouter);
app.use(express.static(path.join(__dirname, 'frontend/build')));

// catch 404 and forward to error handler
app.use('/api/', function (req, res, next) {
    next(createError(404));
});

// error handler
app.use('/api/', function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});

module.exports = app;
