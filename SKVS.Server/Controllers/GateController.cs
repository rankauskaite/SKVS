using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SKVS.Server.Controllers
{
    public class GateController : Controller
    {
        // GET: GateController
        public ActionResult Index()
        {
            return View();
        }

        // GET: GateController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: GateController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: GateController/Create
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

        // GET: GateController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: GateController/Edit/5
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

        // GET: GateController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: GateController/Delete/5
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
