$(document).ready(function(){
  var dic = JSON.parse(parseURLParams(document.URL)["data"][0]);
  console.log("dic: " + JSON.stringify(dic));
  console.log("dic: " + dic["company1"]);
  $("#one").html(dic["company1"][0].toUpperCase());
  $("#two").html(dic["company2"][0].toUpperCase());
  $("#three").html(dic["company3"][0].toUpperCase());
  $("#four").html(dic["company4"][0].toUpperCase());
  $("#five").html(dic["company5"][0].toUpperCase());
  $("#oneL").attr("href", dic["company1"][1])
  $("#twoL").attr("href", dic["company2"][1])
  $("#threeL").attr("href", dic["company3"][1])
  $("#fourL").attr("href", dic["company4"][1])
  $("#fiveL").attr("href", dic["company5"][1])
});

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}
