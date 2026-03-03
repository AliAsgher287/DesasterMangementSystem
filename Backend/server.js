const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Request logger (Debug)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Enable CORS
app.use(cors());

// Root route
app.get('/', (req, res) => {
    res.send('Warm Hands API is running...');
});

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/citizen-help', require('./routes/citizenHelpRoutes'));
app.use('/api/field-reports', require('./routes/fieldReportRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/disasters', require('./routes/disasterRoutes'));
app.use('/api/super-admin', require('./routes/superAdminRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
