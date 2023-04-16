let note;
let current_note;
let session_number = 1;

function add_nav_white() {
  $(".navbar").addClass("nav_white");
}
function rm_nav_white() {
  $(".navbar").removeClass("nav_white");
}
function scrollToTop() {
  $("html, body").animate(
    { scrollTop: $("#news-content").offset().top - 105 },
    0
  );
}
function scrollToTable() {
  $("html, body").animate(
    { scrollTop: $(".news_table_div").offset().top - 100 },
    0
  );
}

//animate background opacity on img loaded
$("<img/>")
  .attr("src", "/../assets/img/test.png")
  .on("load", function () {
    $(this).remove();
    $("#background_top").animate({ opacity: 1 }, 1000);
  });
$("<img/>")
  .attr("src", "/../assets/img/carousel/images1.jpg")
  .on("load", function () {
    $(this).remove();
    $(".item").animate({ opacity: 1 }, 1000);
  });
$(document).ready(function () {
  $(".carousel").animate({ opacity: 1 }, 1000);
  jQuery.fn.carousel.Constructor.TRANSITION_DURATION = 1200;
  let scroll = $(window).scrollTop();
  if (scroll > 0) {
    add_nav_white();
  } else {
    rm_nav_white();
  }
  //change nav background color on click when collapsed
  $(".navbar-toggle").on("click", function () {
    let expand = $(".navbar-toggle").attr("aria-expanded");
    if (expand === "false") {
      $(".navbar").css("background-color", "#316588");
    } else {
      $(".navbar").css("background-color", "transparent");
    }
  });
  //translate breadcrumb text
  let $route = $("#breadcrumb .route");
  $route.html() === "about"
    ? $route.html("關於我們")
    : $route.html() === "news"
    ? $route.html("最新消息")
    : $route.html("公告");
  //hide breadcrumb at home page
  if (window.location.pathname == "/") {
    $("#breadcrumb").hide();
  }
  //hide repeated breadcrumb route on paginate page (eg: news)
  if ($(".route").html() === $("#breadcrumb_last").html()) {
    $(".route").hide();
    $(".prompt").first().hide();
  }
  //get News data via ajax
  $.ajax({
    method: "GET",
    url: "https://taiict-backend.onrender.com/json-data",
    tryCount: 0,
    success: function (data) {
      note = data;
    },
    error: function () {
      this.tryCount++;
      if (this.tryCount <= 9) {
        $.ajax(this);
        return;
      }
      $(".message").html("資料取得失敗，請重新整理頁面再試一次");
      return;
    },
    complete: function () {
      if (note.length) {
        $(".news_table_div").append(
          `
          <table class="news_table">
            <thead>
              <tr>
                <th class="news_table_head">類別</th>
                <th class="news_table_head">日期</th>
                <th class="news_table_head">標題</th>
              </tr>
            </thead>
            <tbody id="news_table_content"></tbody>
          </table>
        `
        );
        $(".message").html("");
      } else {
        $(".message").html("目前暫無最新消息");
      }

      for (let i = 0; i < note.length; i++) {
        note[i][1] = tagToPlainText(note[i][1]);
        note[i][3] = tagToPlainText(note[i][3]);
        $("#news_table_content").prepend(
          `
          <tr class="news_table_row">
            <td class="news_table_data text-center author_td">` +
            note[i][1] +
            `</td>
            <td class="news_table_data text-center date_td">` +
            note[i][2].slice(0, 10) +
            `</td>
            <td class="news_table_data title_td">
              <a onClick="changeNewsContent(` +
            note[i][0] +
            `)">` +
            note[i][3] +
            `</a>
            </td>
          </tr>
        `
        );
      }
      //create pagination
      $(".news table tbody").paginathing({
        perPage: 10,
        insertAfter: "table",
        pageNumbers: true,
        firstLast: !0,
        pageNumbers: 0,
      });
    },
  });
});
$(window).scroll(function () {
  let scroll = $(window).scrollTop();
  if (scroll > 0) {
    add_nav_white();
  } else {
    rm_nav_white();
  }
});
$("#organization a").click(function (event) {
  let target = $(event.target);
  target.next(".info").slideToggle();
});

function changeNewsContent(newsId) {
  $("#news-content").show();
  for (let i = 0; i < note.length; i++) {
    if (note[i][0] == newsId) {
      current_note = note[i];
    }
  }
  $("#news-content").empty();
  $("#news-content").hide();
  let file_tags =
    current_note[5].length == 0
      ? ""
      : "<br /><div>附件：</div><ol class='attachment_list'>";
  for (let i = 0; i < current_note[5].length; i++) {
    let file_tag =
      "<li class='attachment_list_item'><a href='https://taiict-backend.onrender.com/download/" +
      current_note[5][i][0].toString() +
      "' target='_blank' download>" +
      current_note[5][i][1] +
      "</a></li>";
    file_tags += file_tag;
  }
  $("#news-content").append(
    `
    <h2 class="post_title"> ` +
      current_note[3] +
      `</h2>
    <p class="post_category">` +
      current_note[2] +
      ` - ` +
      current_note[1] +
      `</p>
    <div class="post_content">` +
      current_note[4] +
      `<br />` +
      file_tags +
      `</ol>
    </div>
  `
  );
  $("#news-content").fadeIn("slow");
  scrollToTop();
}
function tagToPlainText(code) {
  let text = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return text;
}

$(".session-nav .butn").on("click", function () {
  let index = $(this).attr("class").slice(-1);
  $(".session-container .session").hide();
  $(`.session-container .session${index}`).fadeIn("slow");
  $(".session-nav .butn").removeClass("active-butn");
  $(`.session-nav .btn-session${index}`).addClass("active-butn");
});

$(".session-nav .btn-session1").addClass("active-butn");
