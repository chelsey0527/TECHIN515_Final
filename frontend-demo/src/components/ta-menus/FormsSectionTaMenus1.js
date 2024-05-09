import React from 'react';

export default function FormsSectionTaMenus1() {
    return (
        <React.Fragment>
            <>
                <div>
  <nav className="lg:hidden py-6 px-6 border-b">
    <div className="flex items-center justify-between">
      <a className="text-2xl font-semibold" href="#">
        <img className="h-10" src="artemis-assets/logos/artemis-logo-light.svg" alt="" width="auto" />
      </a>
      <button className="navbar-burger flex items-center rounded focus:outline-none">
        <svg className="text-white bg-indigo-500 hover:bg-indigo-600 block h-8 w-8 p-2 rounded" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <title>Mobile menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
  </nav>
  <div className="hidden lg:block navbar-menu relative z-50">
    <div className="navbar-backdrop fixed lg:hidden inset-0 bg-gray-800 opacity-10" />
  </div>
  <div className="mx-auto lg:ml-80">
    <h1 className="mb-2 text-4xl font-bold font-heading text-3xl font-bold font-heading container mx-auto pt-8">Medication Information</h1>
    <p className="mb-2 mb-2 font-heading container mx-auto">Please fill out the follwing form</p>
    <form action="#" method="post"><div className="mb-6 w-full bg-white px-10 py-5">
        <label className="block text-sm font-medium mb-2" htmlFor="">Medication Name</label>
        <input className="block w-full px-4 py-3 mb-2 text-sm placeholder-gray-500 bg-white border rounded mb-5" type="text" name="" placeholder="Please fill in the name of your medication" /><label className="block text-sm font-medium mb-2" htmlFor="">Box Number</label>
        <div className="relative">
          <select className="appearance-none block w-full px-4 py-3 mb-2 text-sm placeholder-gray-500 bg-white border rounded mb-5" name="field-name"><option>Please select the location of your input pills</option><option>Box 1</option><option>Box 2</option><option>Box 3</option><option>Box 4</option></select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg></div>
        </div>
        <label htmlFor="time" className="block text-sm font-medium mb-2">Intake Schedule</label>
        <div className="relative">
          <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd" /></svg></div>
          <input type="time" id="time" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 appearance-none block w-full px-4 py-3 mb-2 text-sm placeholder-gray-500 bg-white rounded mb-5" min="09:00" max="18:00" defaultValue="00:00" required="" /></div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="">Intake Quantity</label>
          <div className="relative">
            <select className="appearance-none block w-full px-4 py-3 mb-2 text-sm placeholder-gray-500 bg-white border rounded" name="field-name"><option>Please Select</option><option>1 Pill/Time</option><option>2 Pills/Time</option><option>3 Pills/Time</option><option>4 Pills/Time</option><option>5 Pills/Time</option><option>6 Pills/Time</option></select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg></div>
          </div>
        </div>
      </div>
      <button className="inline-block w-full md:w-auto px-6 py-3 font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded transition duration-200" type="submit">Submit</button>
    </form>
  </div>
</div>


            </>
        </React.Fragment>
    );
}

