function openUnit(evt, unitNumber) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Format footnotes within tab
    createFootnote(unitNumber);

    // create a vocab list
    createVocab(unitNumber);

    // create a table of contents
    createToContents(unitNumber);

    // set tab listener
    collapseTab("menu");

    // set vocab listener
    collapseTab("vocab");

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(unitNumber).style.display = "block";
    evt.currentTarget.className += " active";
}

function createFootnote(eleId) {
    // Declare all variables
    var i, ele, fncontent, innercontent;
    // Get element from id
    ele = document.getElementById(eleId);

    if (ele.querySelector("p.footnote") === null) {
        // Find all instances of <h-fn> tags
        fncontent = ele.getElementsByTagName("h-fn");
        for (i = 1; i < fncontent.length + 1; i++) {
            innercontent = fncontent[i - 1].innerHTML;
            // Replace note with anchor
            fncontent[i - 1].innerHTML =
                "<a id=" + eleId.toString() + "_" + i.toString() + " href=#" + eleId.toString() + "_" + i.toString() + "><sup>" + i.toString() + "</sup></a>"
            // Add footnote
            ele.innerHTML += "<p class=\"footnote\" id=" + eleId.toString() + "_" + i.toString() + "><a href=#" + eleId.toString() + "_" + i.toString() + "><sup>" + i.toString() + "</sup></a>&nbsp;" + innercontent + "</p>"

        }
    }

}

function createToContents(eleId) {
    // Declare all variables
    var i, ele, nid, cnm, xct, headcontent, eleholder, headholder, coll;
    const headlist = [];

    // Get element from id
    ele = document.getElementById(eleId);

    if (ele.querySelector("button.toc") === null) {
        headcontent = ele.querySelectorAll("h3, h4, h5");
        for (i = 1; i < headcontent.length + 1; i++) {
            if (!(headcontent[i - 1].matches(".ntoc"))) {
                nid = headcontent[i - 1].innerText.replaceAll(" ", "");
                if (headcontent[i - 1].tagName == "H3") {
                    cnm = "h4";
                    nid = "h3" + nid;
                    xct = "";

                } else if (headcontent[i - 1].tagName == "H4") {
                    cnm = "h5";
                    nid = "h4" + nid;
                    xct = "-&nbsp;&nbsp;";
                } else {
                    cnm = "h6";
                    nid = "h5" + nid;
                    xct = "-&nbsp;&nbsp;&nbsp;&nbsp;";
                }
                headcontent[i - 1].id = nid;
                headlist.push("<" + cnm + "><a href=#" + nid + ">" + xct + headcontent[i - 1].innerHTML + "</a></" + cnm + ">");
            }
        }
        if (headlist.length > 0) {
            eleholder = ele.innerHTML;
            headholder = "<button type=\"button\" class=\"collapsiblemenu toc\">Unit Contents</button><div class=\"toccontent\" style=\"display: none;\">"
            for (i = 1; i < headlist.length + 1; i++) {
                headholder += headlist[i - 1];
            }
            headholder += "</div>"
            ele.innerHTML = headholder + eleholder;
        }
    }
}

function createVocab(eleId) {
    // Declare all variables
    var i, ele, nid, cnm, xct, voccontent, eleholder, vocholder, vocword, vocroot, vocinfo;
    const voclist = [];
    const vocdef = {};

    // Get element from id
    ele = document.getElementById(eleId);

    if (ele.querySelector("button.voc") === null) {

        voccontent = ele.querySelectorAll("span.vocab, span.vocab_quiet");
        for (i = 1; i < voccontent.length + 1; i++) {

            vocword = voccontent[i - 1].innerHTML.split("!!")[0];
            vocroot = vocword.toLowerCase();
            vocinfo = voccontent[i - 1].innerHTML.split("!!")[1];
            if (voclist.includes(vocroot) == false) {
                voclist.push(vocroot);
            }
            if (!(vocinfo === undefined)) {
                if (vocdef[vocroot] === undefined) {
                    vocdef[vocroot] = vocinfo;
                } else {
                    vocdef[vocroot].concat(vocinfo);
                }
            }
        }
        for (i = 1; i < voccontent.length + 1; i++) {
            vocword = voccontent[i - 1].innerHTML.split("!!")[0];
            vocroot = vocword.toLowerCase();
            if (vocdef[vocroot]) {
                voccontent[i - 1].innerHTML = "<span class=\"tooltip=\" title=\"" + vocdef[vocroot] + "\">" + vocword + "</span>";
            }
        }
        if (voclist.length > 0) {
            eleholder = ele.innerHTML;
            vocholder = "<button type=\"button\" class=\"collapsiblevocab voc\">Unit Vocab</button><div class=\"voccontent\" style=\"display: none;\">"
            for (i = 1; i < voclist.length + 1; i++) {
                vocholder += "<span class=\"vocab_entry=\">" + voclist[i - 1][0].toUpperCase() + voclist[i - 1].slice(1) + "</span><br />";
            }
            vocholder += "</div>"
            ele.innerHTML = vocholder + eleholder;
        }
    }
}

function collapseTab(inclass) {
    var collclass = "collapsible" + inclass;
    var coll = document.getElementsByClassName(collclass);
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}
