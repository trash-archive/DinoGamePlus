const FILE_NAME = "Dino Game Feedback";
const SCREENSHOT_FOLDER = "Dino Game Screenshots";
const HEADERS = ["Timestamp", "Type", "Message", "Name", "Upvotes", "Downvotes", "FeedbackId", "ScreenshotUrl"];
const REPLY_HEADERS = ["ReplyId", "FeedbackId", "Name", "Message", "Timestamp", "ScreenshotUrl"];

function getScreenshotFolder() {
  const folders = DriveApp.getFoldersByName(SCREENSHOT_FOLDER);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(SCREENSHOT_FOLDER);
}

function saveScreenshot(base64Data, mimeType, fileName) {
  try {
    const folder = getScreenshotFolder();
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return `https://drive.google.com/uc?export=view&id=${file.getId()}`;
  } catch (e) {
    return "";
  }
}

function getOrCreateSheet() {
  const files = DriveApp.getFilesByName(FILE_NAME);
  let ss;
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
    const sheet = ss.getSheets()[0];
    if (sheet.getLastColumn() > 0) {
      const existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      ["Upvotes", "Downvotes", "FeedbackId", "ScreenshotUrl"].forEach(col => {
        if (!existing.includes(col)) sheet.getRange(1, sheet.getLastColumn() + 1).setValue(col);
      });
    }
  } else {
    ss = SpreadsheetApp.create(FILE_NAME);
    const sheet = ss.getSheets()[0];
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return ss.getSheets()[0];
}

function getOrCreateRepliesSheet() {
  const files = DriveApp.getFilesByName(FILE_NAME);
  if (!files.hasNext()) return null;
  const ss = SpreadsheetApp.open(files.next());
  let repliesSheet = ss.getSheetByName("Replies");
  if (!repliesSheet) {
    repliesSheet = ss.insertSheet("Replies");
    repliesSheet.appendRow(REPLY_HEADERS);
    repliesSheet.setFrozenRows(1);
  } else {
    const existing = repliesSheet.getRange(1, 1, 1, repliesSheet.getLastColumn()).getValues()[0];
    if (!existing.includes("ScreenshotUrl")) {
      repliesSheet.getRange(1, repliesSheet.getLastColumn() + 1).setValue("ScreenshotUrl");
    }
  }
  return repliesSheet;
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "getAllReplies") {
    const repliesSheet = getOrCreateRepliesSheet();
    if (!repliesSheet) return jsonOut({ ok: true, data: [] });
    const rows = repliesSheet.getDataRange().getValues();
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
    return jsonOut({ ok: true, data });
  }

  if (e && e.parameter && e.parameter.feedbackId) {
    const repliesSheet = getOrCreateRepliesSheet();
    if (!repliesSheet) return jsonOut({ ok: true, data: [] });
    const rows = repliesSheet.getDataRange().getValues();
    const headers = rows[0];
    const data = rows.slice(1)
      .map(row => {
        const obj = {};
        headers.forEach((h, i) => obj[h] = row[i]);
        return obj;
      })
      .filter(obj => obj.FeedbackId === e.parameter.feedbackId);
    return jsonOut({ ok: true, data });
  }

  const sheet = getOrCreateSheet();
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const data = rows.slice(1)
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    })
    .filter(obj => obj.FeedbackId && String(obj.Message || "").trim());
  return jsonOut({ ok: true, data });
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
  } catch(err) {
    return jsonOut({ ok: false, error: "Invalid JSON" });
  }
  const sheet = getOrCreateSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const col = (name) => headers.indexOf(name) + 1;

  if (data.action === "reply") {
    const repliesSheet = getOrCreateRepliesSheet();
    const replyId = Utilities.getUuid();
    let screenshotUrl = "";
    if (data.screenshotBase64 && data.screenshotMime) {
      screenshotUrl = saveScreenshot(data.screenshotBase64, data.screenshotMime, `reply-${replyId}`);
    }
    repliesSheet.appendRow([replyId, data.feedbackId, data.name || "Anonymous", data.message || "", new Date(), screenshotUrl]);
    return jsonOut({ ok: true, replyId, screenshotUrl });
  }

  if (data.action && data.feedbackId) {
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][col("FeedbackId") - 1] === data.feedbackId) {
        const upCol = col("Upvotes");
        const downCol = col("Downvotes");
        const up = Number(rows[i][upCol - 1]) || 0;
        const down = Number(rows[i][downCol - 1]) || 0;
        if      (data.action === "upvote")     sheet.getRange(i + 1, upCol).setValue(up + 1);
        else if (data.action === "unupvote")   sheet.getRange(i + 1, upCol).setValue(Math.max(0, up - 1));
        else if (data.action === "downvote")   sheet.getRange(i + 1, downCol).setValue(down + 1);
        else if (data.action === "undownvote") sheet.getRange(i + 1, downCol).setValue(Math.max(0, down - 1));
        break;
      }
    }
    return jsonOut({ ok: true });
  }

  const feedbackId = Utilities.getUuid();
  let screenshotUrl = "";
  if (data.screenshotBase64 && data.screenshotMime) {
    screenshotUrl = saveScreenshot(data.screenshotBase64, data.screenshotMime, `feedback-${feedbackId}`);
  }
  sheet.appendRow([new Date(), data.type || "", data.message || "", data.name || "Anonymous", 0, 0, feedbackId, screenshotUrl]);
  return jsonOut({ ok: true, feedbackId, screenshotUrl });
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
