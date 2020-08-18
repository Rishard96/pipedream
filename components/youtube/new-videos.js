const axios = require('axios')
const youtube = require('https://github.com/PipedreamHQ/pipedream/components/youtube/youtube.app.js')


module.exports = {
  name: "Youtube - New Videos",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    youtube,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
  },  

  async run(event) {
  	let videos = [];
    let totalResults = 1;
    let nextPageToken = null;
    let count = 0;
    let results;

    while (count < totalResults) {
      results = await this.youtube.getVideos(nextPageToken);
      totalResults = results.data.pageInfo.totalResults;
      nextPageToken = results.data.nextPageToken;
      results.data.items.forEach(function (video) {
        videos.push(video);
        count++;
      });
    }

    for (const video of videos) {
      this.$emit(video, {
        id: video.id.videoId,
        summary: video.snippet.title,
        ts: Date.now()
      });
    } 

  }  
};
