using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SKVS.Server.Controllers
{
    public class TruckCompanyController : Controller
    {
        // GET: TruckCompanyController
        public ActionResult Index()
        {
            return View();
        }

        // GET: TruckCompanyController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: TruckCompanyController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: TruckCompanyController/Create
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

        // GET: TruckCompanyController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: TruckCompanyController/Edit/5
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

        // GET: TruckCompanyController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: TruckCompanyController/Delete/5
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
