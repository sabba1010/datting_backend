const getExampleData = (req, res) => {
    res.json({
        success: true,
        message: 'This data is coming from the separate route/controller!',
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    getExampleData
};
