import React, { useState, useEffect } from "react";
import { dummyPostsData, PLATFORMS } from "../assets/assets";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  SendIcon,
  XIcon,
} from "lucide-react";

const Schedura = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setscheduledDate] = useState("");
  const [scheduledTime, setscheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDummyPostData = async () => {
      const data = dummyPostsData;
      setPosts(data);
    };
    fetchDummyPostData();
  }, []);

  const scheduledPosts = posts.filter((p) => p.status === "scheduled");
  const publishedPosts = posts.filter((p) => p.status === "published");

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleSchedule = async (e) => {
    e.prevetDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPosts((prev) => [...prev, dummyPostsData[0]]);
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="w-fill lg:w-115 shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg text-slate-700">Compose Post</h2>
          </div>

          <form className="space-y-5" onSubmit={handleSchedule}>
            <div>
              <label
                htmlFor=""
                className="block text-xs text-slate-500 uppercase mb-2"
              >
                Platforms
              </label>
              <div className=" flex flex-wrap gap-3">
                {PLATFORMS.map((p) => {
                  const active = selectedPlatforms.includes(p.id);

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-1.5 p-3 rounded-md border transition-all duration-150 ${active ? "bg-red-50 border-red-300 text-red-500 scale-103" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                    >
                      <p.icon className="size-4.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor=""
                className="block text-xs text-slate-500 uppercase mb-2"
              >
                Content
              </label>

              <textarea
                required
                rows={5}
                placeholder="What do you want to share today?"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:slate-400 outline-none resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div
                className={`text-rigth text-vs mt-1 font-medium ${content.length > 270 ? "text-red-500" : "text-slate-400"}`}
              >
                {content.length}/280
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">
                Media (optional)
              </label>
              {mediaFile ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  {mediaFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(mediaFile)}
                      alt="preview"
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(mediaFile)}
                      lassName="w-full h-40 object-cover"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => setMediaFile(null)}
                    className="absolute top-2 right-2 size-7 bg-slate-900/60 hover-bg-slate-900/80 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-5 py-10 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group">
                  <span className="text-sm text-slate-500 group-hover:text-red-600 transition-colors">
                    Click to upload{" "}
                  </span>
                  <input
                    type="file"
                    accept="image/* ,video/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files[0] && setMediaFile(e.target.files[0])
                    }
                  />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 uppercase mb-2">
                  Date
                </label>
                <div className="relative">
                  {" "}
                  <CalendarIcon className="size-4 absolute left-3 top-1/2 translate-y-3 text-slate-400 pointer-events-none" />
                </div>
                <input
                  type="date"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none"
                  value={scheduledDate}
                  onChange={(e) => setscheduledDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase mb-2">
                  Time
                </label>
                <div className="relative">
                  {" "}
                  <ClockIcon className="size-4 absolute left-3 top-1/2 translate-y-3 text-slate-400 pointer-events-none" />
                </div>
                <input
                  type="time"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none"
                  value={scheduledTime}
                  onChange={(e) => setscheduledTime(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500 hover:bg-red-600 transition-all text-white rounded-lg"
            >
              {loading ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Scheduling
                </>
              ) : (
                <>
                  Schdeule Post
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <CalendarDaysIcon className="size-4 text-zinc-500" />
            <h3 className="text-slate-900 text-sm">Upcoming</h3>
            <span className="ml-auto text-xs font-bold bg-zinc-100 text-zinx-100 px-2 py-0.5 rounded-full">
              {scheduledPosts.length}
            </span>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
            {scheduledPosts.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No posts Scheduled
              </div>
            ) : (
              <>
                {scheduledPosts.map((post) => {
                  return (
                    <div
                      key={post._id}
                      className="px-5 py-4 hover:bg-slate-50/60 transition-colors "
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1.5 items-center">
                          {post.platforms.map((pl) => {
                            const meta = PLATFORMS.find((p) => p.id === pl);
                            return meta ? (
                              <meta.icon
                                key={pl}
                                className="size-3.5 text-slate-400"
                              />
                            ) : null;
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          {post.mediaType && (
                            <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-.05 rounded-md font-semibold capitalize">
                              {post.mediaType}
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            {new Date(post.scheduledFor).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 max-w-md">
                        {post.content}
                      </p>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <SendIcon className="size-4 text-zinc-500" />
            <h3 className="text-slate-900 text-sm">Published</h3>
            <span className="ml-auto text-xs font-bold bg-zinc-100 text-zinx-100 px-2 py-0.5 rounded-full">
              {publishedPosts.length}
            </span>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
            {publishedPosts.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No Published Posts
              </div>
            ) : (
              <>
                {publishedPosts.map((post) => {
                  return (
                    <div
                      key={post._id}
                      className="px-5 py-4 hover:bg-slate-50/60 transition-colors "
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1.5 items-center">
                          {post.platforms.map((pl) => {
                            const meta = PLATFORMS.find((p) => p.id === pl);
                            return meta ? (
                              <meta.icon
                                key={pl}
                                className="size-3.5 text-slate-400"
                              />
                            ) : null;
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          {post.mediaType && (
                            <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-.05 rounded-md font-semibold capitalize">
                              {post.mediaType}
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            {new Date(post.scheduledFor).toLocaleString()}
                          </span>
                          <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">Published</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 max-w-4/5">
                        {post.content}
                      </p>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedura;
