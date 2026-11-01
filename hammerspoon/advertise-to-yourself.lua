-- Advertise to Yourself: Hammerspoon side.
--   1. Cmd+T in Arc opens the goals page (Arc ignores new tab extensions).
--   2. A localhost server the page saves edits through. It rewrites goals.js,
--      which Chrome (extension) and Arc (file://) both load.
--
-- Install: copy this file to ~/.hammerspoon/ and add
--   require("advertise-to-yourself")
-- to ~/.hammerspoon/init.lua.

local M = {}

-- Change this if you cloned the repo somewhere else.
local GOALS_DIR = os.getenv("HOME") .. "/advertise-to-yourself/extension"
local NEW_TAB_URL = "file://" .. GOALS_DIR .. "/newtab.html"
local PORT = 47811

-- Apps where Cmd+T opens the goals page. Chrome uses the extension instead.
local BROWSERS = { ["Arc"] = true }

M.newTab = hs.hotkey.new({"cmd"}, "t", function()
  local app = hs.application.frontmostApplication():name()
  hs.osascript.applescript(
    'tell application "' .. app .. '" to tell front window to make new tab with properties {URL:"' .. NEW_TAB_URL .. '"}')
end)

-- Activate/deactivate events can arrive in either order when switching apps,
-- so always re-check which app is actually in front.
local function syncHotkey()
  local front = hs.application.frontmostApplication()
  if front and BROWSERS[front:name()] then M.newTab:enable() else M.newTab:disable() end
end

M.watcher = hs.application.watcher.new(function()
  hs.timer.doAfter(0.05, syncHotkey)
end)
M.watcher:start()
syncHotkey()

local function validGoals(goals)
  if type(goals) ~= "table" then return false end
  for _, g in ipairs(goals) do
    if type(g) ~= "table" or type(g.title) ~= "string" or g.title == "" then return false end
    for _, key in ipairs({"from", "date"}) do
      if type(g[key]) ~= "string" or not g[key]:match("^%d%d%d%d%-%d%d%-%d%d$") then return false end
    end
  end
  return true
end

local function writeGoals(goals)
  local clean = {}
  for _, g in ipairs(goals) do
    table.insert(clean, { title = g.title, from = g.from, date = g.date })
  end
  local f = io.open(GOALS_DIR .. "/goals.js", "w")
  f:write("// Edited from the new tab page (or by hand). date = deadline, from = first day it shows.\n")
  f:write("// Goals disappear the day after their deadline.\n")
  f:write("const GOALS = " .. hs.json.encode(clean, true) .. ";\n")
  f:close()
end

M.server = hs.httpserver.new(false, false)
M.server:setInterface("localhost")
M.server:setPort(PORT)
M.server:setCallback(function(method, path, headers, body)
  -- Only the extension page and the file:// page may save. Web pages send their own origin.
  local origin = headers["Origin"] or headers["origin"] or ""
  local cors = { ["Access-Control-Allow-Origin"] = "*" }
  if not (origin == "null" or origin:match("^chrome%-extension://")) then
    return "forbidden", 403, cors
  end
  if method ~= "POST" or path ~= "/goals" then return "not found", 404, cors end

  local ok, goals = pcall(hs.json.decode, body)
  if not ok or not validGoals(goals) then return "bad goals", 400, cors end
  writeGoals(goals)
  return "ok", 200, cors
end)
M.server:start()

return M
