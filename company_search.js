const fs = require('fs');

var company_data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

module.exports = {

  findCompanies: function (size, languages, roles, platforms, locations) {
    //console.log("company_data: " + JSON.stringify(company_data));

    console.log("findCompanies");

    var companies = scoreCompanies(size, languages, roles, platforms, locations)


    companies = companies.sort(Comparator);

    //console.log(companies);
    for(var i=0;i<companies.length;i++) {
      console.log("Name: " + companies[i][0] + " | Score: " + companies[i][1] + " | Size: " + companies[i][2] + " | Languages: " + companies[i][3] + " | Roles: " + companies[i][4] + " | Platform: " + companies[i][5] + " | Locations: " + companies[i][6]);
    }



    console.log(companies.length);

    console.log("---------------------");
    console.log(" | Size: " + size + " | Languages: " + languages + " | Roles: " + roles + " | Platform: " + platforms + " | Locations: " + locations);

    // return company names and URLs in order
  }

};

function scoreCompanies(size, languages, roles, platforms, locations) {
  console.log("scoreCompanies");
  console.log("Number of companies: " + company_data.length);

  var companies = [];

  for (var i=0;i<company_data.length;i++) {
    var company_name = company_data[i]["company"];
    var company_size = company_data[i]["size"];
    var company_languages = company_data[i]["languages"];
    var company_roles = company_data[i]["positions"];
    var company_platform = company_data[i]["platform"];
    var company_locations = [];
    for (var j=0;j<company_data[i]["locations"].length;j++) {
      //console.log("Location parse: " + company_data[i]["locations"][j].split(",")[0].toLowerCase());// + [company_data[i]["languages"][j]);
      company_locations.push(company_data[i]["locations"][j].split(",")[0].toLowerCase());
    }
    //console.log("Name: " + company_name + " | Size: " + company_size + " | Languages: " + company_languages + " | Roles: " + company_roles + " | Platform: " + company_platform + " | Locations: " + company_locations);

    var score = 0;

    if (company_size != "" && company_size == size) {score++}
    if (company_size != "" && company_size != size) {score--}
    for (var x=0;x<languages.length;x++) {
      if (company_languages.arrayContains(languages[x])) {score++}
    }
    for (var y=0;y<roles.length;y++) {
      if (company_roles.arrayContains(roles[y])) {score = score + 3}
      else {score = score - 3}
    }
    if (platforms.arrayContains(company_platform)) {score++}
    for (var z=0;z<locations.length;z++) {
      if (company_locations.arrayContains(locations[z])) {score++}
    }
    //"medium",["java", "python"],["SE"],["backend"],["mountain view"]
    //console.log("Name: " + company_name + " **** Score: " + score + " ****");
    companies.push([company_name,score,company_size,company_languages,company_roles,company_platform,company_locations]);
  }

  return companies //return array of scroed company names and URLs
}

Array.prototype.arrayContains = function(k) {
	for(var i=0;i<this.length;i++) {
		if(this[i] === k) {return true}
	}
  return false
}

function Comparator(a, b) {
  if (a[1] > b[1]) return -1;
  if (a[1] < b[1]) return 1;
  return 0;
}
