
invite link 

https://discordapp.com/oauth2/authorize?client_id=537333904995123212&scope=bot

heroku:
vagrantdiscordbot@gmail.com
Bot1234!

1) !showX
-- Send user DM of their X most recently due jobs.

-------------------------
2) Overburden Warning
-- Issue a warning when a user is assigned more than Y jobs
-------------------------
3) Publish to Changelog
-- Completed jobs (whether in channel, or via DM) should populate in #changelog

4) Changelog Clearing
-- !undone jobs are deleted from #changelog via censorship-style search-and-destroy moderation

5/6) Improve Job Blurb Box
-- Include the following data in the Job Blurb bottom (ideally, very small fonts):
---- Assigned By: (@username) -
---- Assigned To: (@username) -
---- Assigned On: (DD/MM/YYY) -
---- Completed By: (@username) -
---- Completed On: (DD/MM/YYYY) -
---- Transfers: (string "@username1, @username2, @username3, @username4")

7) Due Date improvements
-- !assigns without data included for date should default to a due date of today+3
-- If (!assign "work" @Keadin#2022 5) then assign due date of today+5