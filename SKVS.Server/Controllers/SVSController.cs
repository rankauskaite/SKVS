using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SKVS.Server.Controllers
{
    public class SVSController : Controller
    {
        // GET: SVSController
        public ActionResult Index()
        {
            return View();
        }

        // GET: SVSController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: SVSController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: SVSController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: SVSController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: SVSController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: SVSController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: SVSController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
