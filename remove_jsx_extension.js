var fs = require("fs");
var glob = require("glob");

glob("dist/**/*.jsx", (err, matches) => {
    for (let match of matches) {
        fs.rename(match, match.replace(/\.[^/.]+$/, "")+'.js', function(err) {
            if (err) throw err;
            console.log("Removed jsx extension from",match);
        });
    }
});
