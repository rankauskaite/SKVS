using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SKVS.Server.Controllers
{
    public class CommunicationController : Controller
    {
        // GET: CommunicationController
        public ActionResult Index()
        {
            return View();
        }

        // GET: CommunicationController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: CommunicationController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: CommunicationController/Create
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

        // GET: CommunicationController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: CommunicationController/Edit/5
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

        // GET: CommunicationController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: CommunicationController/Delete/5
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
